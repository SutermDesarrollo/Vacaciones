"use client";
import { Checkbox, Container, Grid, Typography } from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "../ui/forms/TextField";
import Button from "../ui/forms/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "../utils/supabaseClient";
import toast from "react-hot-toast";

import { saveUserToLocalStorage } from "../utils/userLocalStorage";
import { SiteData } from "../ui/ClientProvider";

const INITIAL_FORM_STATE = {
  rpe: "",
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  rpe: Yup.string()
    .required("Campo Obligatorio")
    .min(5, "El RPE debe de tener 5 dígitos")
    .max(5, "El RPE debe de tener 5 dígitos"),
  password: Yup.string().required("Campo Obligatorio"),
});

function LoginPage() {
  const { setUserReact } = SiteData();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async ({ rpe, password }) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "RPE,nombre,antiguedad,area,dias_disponibles,dias_nuevos,dias_solicitados"
      )
      .eq("RPE", rpe.toUpperCase())
      .eq("contrasena", password.toUpperCase())
      .single();

    if (data) {
      saveUserToLocalStorage(data);
      setUserReact(data);
      toast.success("Iniciando Sesion");
      router.push("/agenda");
    } else {
      toast.error("Credenciales incorrectas");
      console.log(error);
    }
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>SUTEM Seccion 102</Typography>
              <Typography>Iniciar Sesión</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="rpe"
                label="RPE"
                style={{ textTransform: "uppercase" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                label="Contraseña"
                style={{ textTransform: "uppercase" }}
                type={showPassword ? "text" : "password"}
              />
            </Grid>

            <Grid item xs={12}>
              <Checkbox
                sx={{ color: "#0a0a0a" }}
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <Typography variant="caption">Mostrar Contraseña</Typography>
            </Grid>

            <Grid item xs={12}>
              <Button>Iniciar</Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
}

export default LoginPage;
