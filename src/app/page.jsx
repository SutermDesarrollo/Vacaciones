"use client";
import { Button, Container, Link } from "@mui/material";
import Image from "next/image";
import Logo from "../../public/suterm_seccion102.jpg";
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
      <Image src={Logo} style={{ height: "50%", width: "auto" }} alt="Suterm" />
      <Button variant="contained" onClick={handleAgenda}>
        Solicitar Vacaciones
      </Button>
    </Container>
  );
}

export default page;
