"use client";
import { Checkbox, Container, Link, Typography, Grid } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../../ui/Forms/TextField";
import Button from "../../ui/Forms/Button";
import { useState } from "react";
import supabase from "@/app/utils/supabaseClient";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

const { data, error } = await supabase.from("countries").select();
console.log(data, error);

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

function Page() {
  const [showPassword, setShowPassword] = useState(false);

  //const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const { error } = await supabase.from("usuarios").select();
      if (error) {
        throw error;
      }
      console.log("todo bien");
      router.push("/agenda");
    } catch (error) {
      console.log(error);
    }
    console.log(values);
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
              <Typography>Iniciar Sesión</Typography>
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
              <Button>Iniciar</Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
      <Typography sx={{ marginTop: "1rem" }}>
        ¿No tienes cuenta?-
        <Link href="/auth/register" underline="hover">
          Crear cuenta
        </Link>
      </Typography>
    </Container>
  );
}

export default Page;
