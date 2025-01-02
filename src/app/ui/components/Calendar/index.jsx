"use client ";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect, useState } from "react";
dayjs.locale("es");

import supabase from "../../../utils/supabaseClient";
import { getUserFromLocalStorage } from "../../../utils/userLocalStorage";

const localizer = dayjsLocalizer(dayjs);

function CalendarComponent() {
  const [propuestasList, setPropuestasList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = getUserFromLocalStorage();
      if (user) {
        let fetchedPropuestas = [];
        const { data: usuarios, error } = await supabase
          .from("usuarios")
          .select("RPE, nombre")
          .eq("area", user.area)
          .eq("registro_vacaciones", true);
        if (error) {
          throw new Error("Error en BD");
        }
        //Obtener usuarios en area que ya agendaron

        if (usuarios) {
          for (const usuario of usuarios) {
            const { data: propuestas, error } = await supabase
              .from("propuestas")
              .select("fecha_inicio,fecha_fin")
              .eq("rpe_usuario", usuario.RPE);
            if (error) {
              console.log(error);
            }
            if (propuestas) {
              fetchedPropuestas = fetchedPropuestas.concat(
                propuestas.map((propuesta) => ({
                  title: usuario.nombre,
                  start: new Date(propuesta.fecha_inicio),
                  end: new Date(propuesta.fecha_fin),
                }))
              );
            }
          }
          setPropuestasList(fetchedPropuestas);
        }
      } else {
        throw new Error("No estas logeado");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ height: "600px" }}>
      Propuestas registradas en tu departamento
      <Calendar
        localizer={localizer}
        events={propuestasList}
        startAccessor="start"
        endAccessor="end"
        views={["month", "day"]}
      />
    </div>
  );
}

export default CalendarComponent;
