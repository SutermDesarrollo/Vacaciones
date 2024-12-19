"use client";
import { Grid, Container, Typography, Button as Boton } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../ui/forms/TextField";
import Button from "../ui/forms/Button";
import NumberLabel from "../ui/components/NumberLabel";

import DateTimePicker from "../ui/forms/DateTimePicker";
import { getUserFromLocalStorage } from "../utils/userLocalStorage";
import toast from "react-hot-toast";

import { checkConstraints } from "./contraints";
import { insertVacation } from "./insertVacation";
import { SiteData } from "../ui/ClientProvider";
import { useState, useEffect } from "react";

const INITIAL_FORM_STATE = {
  motivo: "",
  fechaInicio: "",
  fechaFin: "",
};

const FORM_VALIDATION = Yup.object().shape({
  motivo: Yup.string().required("Required"),
  fechaInicio: Yup.date().required("Required"),
  fechaFin: Yup.date().required("Required"),
});

import { cerrarRegistro, siguienteEnLineaPorArea } from "./dbEntries";
import { useRouter } from "next/navigation";

function page() {
  const [disabled, setDisabled] = useState(true);

  //==============================Revisar antiguedad
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserFromLocalStorage();
      if (user) {
        const siguienteEnLinea = await siguienteEnLineaPorArea(user.area);

        if (siguienteEnLinea.RPE === user.RPE) {
          toast.success("Ingresa tus solicitudes", { id: "success" });
          setDisabled(false);
        } else {
          toast.error("Actualmente no puedes registrar", { id: "error1" });
          toast.error(
            `${siguienteEnLinea.nombre} está en proceso de registro`,
            { id: "error2" }
          );
        }
      } else {
        toast.error("No estas registrado");
      }
    };
    fetchData();
  }, []);

  const { userState, setUserState } = SiteData();

  const handleSubmit = async ({ motivo, fechaInicio, fechaFin }) => {
    const router = useRouter();
    const user = getUserFromLocalStorage();

    if (user) {
      const isValid = await checkConstraints(
        user,
        motivo,
        fechaInicio,
        fechaFin
      );
      if (isValid) {
        try {
          const updatedUser = await insertVacation(
            user,
            motivo,
            fechaInicio,
            fechaFin
          );
          setUserState(updatedUser);
          toast.success("Propuesta Registrada");
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      toast.success("No estas logeado");
    }
  };

  const handleCerrarRegistro = async () => {
    const user = getUserFromLocalStorage();

    await cerrarRegistro(user.RPE);
    toast.success("Se cerro tu registro correctamente");
    router.push("/");
  };

  return (
    <Container
      sx={{
        height: "100vh",
        paddingTop: "1rem",
        backgroundColor: "whitesmoke",
      }}
    >
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: "3rem", paddingRight: "3rem" }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <NumberLabel
                number={userState ? userState.dias_disponibles : 0}
                label={"Dias Disponibles"}
              />
              <NumberLabel
                number={userState ? userState.dias_nuevos : 0}
                label={"Dias Nuevos"}
              />
              <NumberLabel number={0} label={"Dias Solicitados"} />
            </Grid>

            <Grid item xs={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography>Solicitar Vacaciones</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField name="motivo" label="Motivo" disabled={disabled} />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    name="fechaInicio"
                    label="Dia Inicio"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    name="fechaFin"
                    label="Dia fin"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button disabled={disabled}>Solicitar</Button>
                </Grid>
                <Grid item xs={6}>
                  <Boton
                    variant="contained"
                    disabled={disabled}
                    onClick={handleCerrarRegistro}
                  >
                    Cerrar Registro
                  </Boton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
}

export default page;
