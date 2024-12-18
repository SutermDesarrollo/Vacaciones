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
        backgroundColor: "whitesmoke",
      }}
    >
      Sistema de Propuesta de vacaciones
      <Link href="/agenda" underline="hover">
        Agenda
      </Link>
    </Container>
  );
}

export default page;
