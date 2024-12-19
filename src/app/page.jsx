"use client";
import { Button, Container, Link } from "@mui/material";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  const handleAgenda = () => {
    router.push("/agenda");
  };
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke",
      }}
    >
      Sistema de Propuesta de Vacaciones
      <Button variant="contained" onClick={handleAgenda}>
        Solicitar Vacaciones
      </Button>
    </Container>
  );
}

export default page;
