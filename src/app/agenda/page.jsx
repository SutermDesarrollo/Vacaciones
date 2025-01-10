"use client";
import { Grid, Container, Typography, Button as Boton } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Button from "../ui/forms/Button";
import Select from "../ui/forms/Select";
import DisplayValues from "../ui/components/DisplayValues";
import TermsList from "../ui/components/TermsList";
import data from "../data/motivos.json";

import DateTimePicker from "../ui/forms/DateTimePicker";
import { getUserFromLocalStorage } from "../utils/userLocalStorage";
import toast from "react-hot-toast";

import { validaciones } from "./functions/validaciones";
import { insertarPropuesta } from "./functions/insertVacation";
import { SiteData } from "../ui/ClientProvider";
import { useState, useEffect } from "react";

import { cerrarRegistro, siguienteEnLineaPorArea } from "./functions/dbQueries";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import "dayjs/locale/es";
import Calendar from "../ui/components/Calendar";
dayjs.locale("es");

const INITIAL_FORM_STATE = {
  motivo: "",
  fechaInicio: "",
  fechaFin: "",
};

const FORM_VALIDATION = Yup.object().shape({
  motivo: Yup.string().required("Requerido"),
  fechaInicio: Yup.date().required("Requerido"),
  fechaFin: Yup.date()
    .min(Yup.ref("fechaInicio"), "Dia Fin no puede ser antes de Dia Inicio")
    .required("Requerido"),
});

function page() {
  const [disabled, setDisabled] = useState(true);
  const { userReact, setUserReact } = SiteData();
  const router = useRouter();

  //-- RevisarAntiguedad----------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const user = getUserFromLocalStorage();
      if (user) {
        const siguienteEnLinea = await siguienteEnLineaPorArea(user.area);

        if (siguienteEnLinea.RPE === user.RPE) {
          toast.success("Ingresa tus solicitudes", { id: "success" });
          setDisabled(false);
        } else {
          toast.error("Actualmente no puedes registrar", { id: "error1" });
          toast.error(
            `${siguienteEnLinea.nombre} del area: ${siguienteEnLinea.area} está en proceso de registro`,
            { id: "error2" }
          );
        }
      } else {
        toast.error("No estas registrado", { id: "notLoggedIn" });
      }
    };
    fetchData();
  }, []);

  //-- Entregar Propuesta----------------------------------------------------
  const handleSubmit = async ({ motivo, fechaInicio, fechaFin }) => {
    const user = getUserFromLocalStorage();

    if (user) {
      const esValido = await validaciones(user, motivo, fechaInicio, fechaFin);

      if (esValido) {
        try {
          const updatedUser = await insertarPropuesta(
            user,
            motivo,
            fechaInicio,
            fechaFin
          );
          setUserReact(updatedUser);
          toast.success("Propuesta Registrada");
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    } else {
      toast.success("No estas logeado");
      router.push("/login");
    }
  };

  //-- Cerrar Registro----------------------------------------------------
  const handleCerrarRegistro = async () => {
    const userConfirmed = window.confirm(
      "¿Cerrar el registro? Una vez cerrado no podrás hacer más acciones"
    );

    if (userConfirmed) {
      const user = getUserFromLocalStorage();

      await cerrarRegistro(user.RPE);
      toast.success("Se cerro tu registro correctamente");
      router.push("/");
    }
  };

  return (
    <Container
      sx={{
        height: "100%",
        paddingTop: "1rem",
        backgroundColor: "whitesmoke",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="overline">Solicitar Vacaciones</Typography>

      {userReact ? (
        <>
          <Typography>Area: {userReact.area}</Typography>
          <Typography>
            Fecha de Antiguedad: {dayjs(userReact.antiguedad).format("DD-MMM")}
          </Typography>
        </>
      ) : null}

      <Grid container spacing={2}>
        <DisplayValues />
      </Grid>

      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2} paddingY={"1rem"}>
            <Grid item xs={12}>
              <Select
                name="motivo"
                label="Motivo"
                disabled={disabled}
                options={data}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                name="fechaInicio"
                label="Dia Inicio"
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                name="fechaFin"
                label="Dia fin"
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Button disabled={disabled}>Solicitar</Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>

      <Grid container spacing={2}>
        <Grid item xs={12} overflow={"auto"}>
          <TermsList />
        </Grid>
        <Grid item xs={12}>
          <Calendar />
        </Grid>
        <Grid item xs={12}>
          <Boton
            variant="contained"
            disabled={disabled}
            fullWidth={true}
            onClick={handleCerrarRegistro}
            sx={{ backgroundColor: "#745cd0" }}
          >
            Cerrar Registro
          </Boton>
        </Grid>
      </Grid>
    </Container>
  );
}

export default page;
