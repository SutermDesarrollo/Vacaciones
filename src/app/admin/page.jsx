"use client";
import { Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

const datos = [
  { id: "1", motivo: "hola" },
  { id: "2", motivo: "como" },
];

function Page() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("propuestas").select();
      setSolicitudes(data);
    };
    fetchData();
  }, []);

  const solis = async () => {
    const { data, error } = await supabase.from("propuestas").select();
    await setSolicitudes(data);
    console.log(data);
  };

  return (
    <Container
      sx={{
        height: "100vh",
        paddingTop: "1rem",
        backgroundColor: "whitesmoke",
      }}
    >
      <Typography>Panel de Admin</Typography>
      <Button onClick={solis}>Solicitudes</Button>
      <div id="contenedor"></div>
    </Container>
  );
}

export default Page;
