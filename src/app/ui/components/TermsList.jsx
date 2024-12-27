import supabase from "../../utils/supabaseClient";
import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userLocalStorage";
import React, { useEffect, useState } from "react";

import { TbArrowBigRightLines } from "react-icons/tb";
import { Box, IconButton } from "@mui/material";
import { RiEdit2Line, RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { SiteData } from "../ClientProvider";

export default function TermsList() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getUserFromLocalStorage();

  const fetchSolicitudes = async () => {
    const user = getUserFromLocalStorage();
    try {
      const { data, error } = await supabase
        .from("propuestas")
        .select()
        .eq("rpe_usuario", user.RPE);
      if (error) {
        throw new Error("Error en BD");
      }

      setSolicitudes(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
    supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "propuestas" },
        (payload) => {
          fetchSolicitudes();
        }
      )
      .subscribe();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            margin: "1rem",
          }}
        >
          {solicitudes.map((element, index) => (
            <TermCard
              Term={element}
              key={index}
              fetchSolicitudes={fetchSolicitudes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TermCard = ({ Term, fetchSolicitudes }) => {
  const { setUserState } = SiteData();

  const handleDelete = async (id) => {
    //Recuperar antes de eliminar
    const { data, error } = await supabase
      .from("propuestas")
      .select()
      .eq("id_propuesta", id)
      .single();
    if (error) {
      console.log(error);
    }

    //Eliminar
    const response = await supabase
      .from("propuestas")
      .delete()
      .eq("id_propuesta", id);

    //Actualizar campos
    const user = getUserFromLocalStorage();
    user.dias_disponibles = user.dias_disponibles + data.disponibles_consumidos;
    user.dias_nuevos = user.dias_nuevos + data.nuevos_consumidos;
    saveUserToLocalStorage(user);
    setUserState(user);

    //Actualizar lista y notificar
    fetchSolicitudes();
    toast.success("Propuesta eliminada");
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "4px",
        width: "300px",
        border: "2px solid #D3D3D3",
        backgroundColor: "#D3D3D3",
        borderRadius: "8px",
      }}
    >
      <div>{Term.motivo}</div>
      <div>
        {Term.fecha_inicio} <TbArrowBigRightLines /> {Term.fecha_fin}
      </div>
      <div>
        <IconButton
          aria-label="trash"
          onClick={() => handleDelete(Term.id_propuesta)}
          sx={{ color: "red" }}
        >
          <RiDeleteBin5Line />
        </IconButton>
      </div>
    </Box>
  );
};
