"use client";
import React, { useEffect, useState } from "react";
import TermsList from "./TermsList";
import Calendar from "./Calendar";
import supabase from "../../utils/supabaseClient";
import { getUserFromLocalStorage } from "../../utils/userLocalStorage";
import toast from "react-hot-toast";

const user = getUserFromLocalStorage();

function Propuestas() {
  const [dataTermsList, setDataTermsList] = useState([]);
  const [dataCalendar, setDataCalendar] = useState([]);

  const fetchPropuestas = async () => {
    try {
      if (user) {
        const { data: usuarios, error: errorUsuarios } = await supabase
          .from("usuarios")
          .select("RPE,nombre")
          .eq("area", user.area)
          .or(
            `area.eq.${user.area},registro_vacaciones.eq.true,RPE.eq.${user.RPE}`
          );
        if (errorUsuarios) throw new Error("Error en BD");

        if (usuarios) {
          let auxDataCalendar = [];
          for (const usuario of usuarios) {
            const { data: propuestas, error: errorPropuestas } = await supabase
              .from("propuestas")
              .select()
              .eq("rpe_usuario", usuario.RPE);
            if (errorPropuestas) throw new Error("Error en BD");

            if (propuestas) {
              if (user.RPE == usuario.RPE) {
                setDataTermsList(propuestas);
                auxDataCalendar = auxDataCalendar.concat(
                  propuestas.map((propuesta) => ({
                    title: usuario.nombre,
                    start: new Date(propuesta.fecha_inicio + "T00:00:00-06:00"),
                    end: new Date(propuesta.fecha_fin + "T23:59:59-06:00"),
                    data: {
                      self: true,
                    },
                  }))
                );
              } else {
                auxDataCalendar = auxDataCalendar.concat(
                  propuestas.map((propuesta) => ({
                    title: usuario.nombre,
                    start: new Date(propuesta.fecha_inicio + "T00:00:00-06:00"),
                    end: new Date(propuesta.fecha_fin + "T23:59:59-06:00"),
                    data: {
                      self: false,
                    },
                  }))
                );
              }
            }
          }
          setDataCalendar(auxDataCalendar);
        }
      } else {
        throw new Error("No estas logeado");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPropuestas();
    supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "propuestas" },
        (payload) => {
          if (user) {
            if (payload.new.rpe_usuario == user.RPE) {
              fetchPropuestas();
            }
          }
        }
      )
      .subscribe();
  }, []);

  return (
    <>
      <TermsList
        dataTermsList={dataTermsList}
        fetchPropuestas={fetchPropuestas}
      />
      <Calendar dataCalendar={dataCalendar} />
    </>
  );
}

export default Propuestas;
