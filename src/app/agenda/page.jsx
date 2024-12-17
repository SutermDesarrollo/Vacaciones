"use client";
import { Grid, Container, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../ui/forms/TextField";
import Button from "../ui/forms/Button";
import Select from "../ui/forms/Select";
import NumberLabel from "../ui/components/NumberLabel";
import { DateCalendar } from "@mui/x-date-pickers";

import DateTimePicker from "../ui/forms/DateTimePicker";
import { getUserFromLocalStorage } from "../utils/userLocalStorage";
import toast from "react-hot-toast";
import supabase from "../utils/supabaseClient";
import { useEffect, useState } from "react";

const INITIAL_FORM_STATE = {
  motivo: "",
  diaInicio: "",
  diaFin: "",
};

const FORM_VALIDATION = Yup.object().shape({
  motivo: Yup.string().required("Required"),
  diaInicio: Yup.date().required("Required"),
  diaFin: Yup.date().required("Required"),
});

const handleSubmit = async ({ motivo, diaInicio, diaFin }) => {
  const user = getUserFromLocalStorage();
  if (user) {
    const { error } = await supabase.from("propuestas").insert({
      motivo: motivo,
      fecha_inicio: diaInicio,
      fecha_fin: diaFin,
      rpe_usuario: user.RPE,
    });
    if (error) {
      console.log(error);
    }
    toast.success("Propuesta Enviada");
  } else {
    toast.error("Ocurrió un error");
  }
};

function page() {
  const [usuario, setUsuario] = useState({
    dias_disponibles: 0,
    dias_nuevos: 0,
  });
  useEffect(() => {
    setUsuario(getUserFromLocalStorage);
  }, []);
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
                number={usuario.dias_disponibles}
                label={"Dias Disponibles"}
              />
              <NumberLabel number={usuario.dias_nuevos} label={"Dias Nuevos"} />
              <NumberLabel number={0} label={"Dias Solicitados"} />
            </Grid>

            <Grid item xs={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography>Solicitar Vacaciones</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField name="motivo" label="Motivo" />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker name="diaInicio" label="Dia Inicio" />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker name="diaFin" label="Dia fin" />
                </Grid>
                <Grid item xs={12}>
                  <Button>Solicitar</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <DateCalendar />
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
}

export default page;
