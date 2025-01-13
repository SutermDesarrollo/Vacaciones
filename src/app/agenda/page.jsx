"use client";
import { Grid, Container, Typography, Button as Boton } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Button from "../ui/forms/Button";
import Select from "../ui/forms/Select";
import DisplayValues from "../ui/components/DisplayValues";
import CerrarRegistro from "../ui/components/CerrarRegistro";
import data from "../data/motivos.json";

import DateTimePicker from "../ui/forms/DateTimePicker";
import { getUserFromLocalStorage } from "../utils/userLocalStorage";
import toast from "react-hot-toast";

import { validaciones } from "./functions/validaciones";
import { insertarPropuesta } from "./functions/insertVacation";
import { SiteData } from "../ui/ClientProvider";
import { useState, useEffect } from "react";

import { siguienteEnLineaPorArea } from "./functions/dbQueries";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import "dayjs/locale/es";
import Propuestas from "../ui/components/Propuestas";
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

  //-- Revisar Antiguedad----------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const user = getUserFromLocalStorage();
      if (user) {
        const siguienteEnLinea = await siguienteEnLineaPorArea(user.area);

        if (siguienteEnLinea) {
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
          toast.error("Actualmente no puedes registrar", { id: "error2" });
        }
      } else {
        toast.error("No estas registrado", { id: "notLoggedIn" });
        router.push("/login");
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
        <Grid item xs={12}>
          <Propuestas />
        </Grid>
        <Grid item xs={12}>
          <CerrarRegistro disabled={disabled} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default page;
