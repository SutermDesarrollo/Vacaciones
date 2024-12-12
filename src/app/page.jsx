import { Container, Link } from "@mui/material";
import React from "react";

function page() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Landing Page
      <Link href="/auth/login" underline="hover">
        Iniciar Sesion
      </Link>
      <Link href="/auth/register" underline="hover">
        Crear cuenta
      </Link>
    </Container>
  );
}

export default page;
