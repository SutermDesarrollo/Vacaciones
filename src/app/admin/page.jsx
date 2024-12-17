import { Container, Typography } from "@mui/material";
import Link from "next/link";

function Page() {
  return (
    <Container
      sx={{
        height: "100vh",
        paddingTop: "1rem",
        backgroundColor: "whitesmoke",
      }}
    >
      <Typography>Panel de Admin</Typography>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        <Link href={"/admin"}>Dashboard</Link>
        <Link href={"/admin"}>Solicitudes</Link>
        <Link href={"/admin"}>Reportes</Link>
      </nav>
    </Container>
  );
}

export default Page;
