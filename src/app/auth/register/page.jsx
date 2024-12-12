"use client";
import { Grid, Checkbox, Container, Link, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../../ui/Forms/TextField";
import Select from "../../ui/Forms/Select";
import Button from "../../ui/Forms/Button";
import areas from "../../data/areas.json";
import { useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_FORM_STATE = {
  rpe: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  area: "",
};

const FORM_VALIDATION = Yup.object().shape({
  rpe: Yup.string()
    .required("Required")
    .min(5, "Must be exactly 5 digits")
    .max(5, "Must be exactly 5 digits"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  area: Yup.string().required("Required"),
});

function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = (values) => {
    router.push("/agenda");
  };

  return (
    <Container sx={{ marginTop: "3rem" }}>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Registrar Usuario</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField name="rpe" label="RPE" />
            </Grid>

            <Grid item xs={6}>
              <TextField name="firstName" label="First Name" />
            </Grid>

            <Grid item xs={6}>
              <TextField name="lastName" label="Last Name" />
            </Grid>

            <Grid item xs={12}>
              <TextField name="email" label="Correo Electronico" />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
              />
            </Grid>

            <Grid item xs={12}>
              <Checkbox
                sx={{ color: "whitesmoke" }}
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <Typography variant="caption">Mostrar Contraseña</Typography>
            </Grid>

            <Grid item xs={12}>
              <Select name="area" label="Area" options={areas} />
            </Grid>

            <Grid item xs={12}>
              <Button>Registrar</Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
      <Typography sx={{ marginTop: "1rem" }}>
        ¿Ya tienes cuenta?-
        <Link href="/auth/login" underline="hover">
          Inicia sesión
        </Link>
      </Typography>
    </Container>
  );
}

export default Page;
