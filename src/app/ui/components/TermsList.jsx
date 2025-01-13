"use client";
import supabase from "../../utils/supabaseClient";
import { getUserFromLocalStorage } from "../../utils/userLocalStorage";
import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import { FaArrowRightLong } from "react-icons/fa6";
import { FcCalendar } from "react-icons/fc";

import OptionsMenu from "../components/OptionsMenu";

export default function TermsList({ dataTermsList, fetchPropuestas }) {
  const [solicitudes, setSolicitudes] = useState(dataTermsList);

  useEffect(() => {
    if (dataTermsList) {
      setSolicitudes(dataTermsList);
    }
  }, [dataTermsList]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {solicitudes.length > 0 ? (
        <>
          Solicitudes
          {solicitudes.map((element, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#745cd0",
                borderRadius: "4px",
                padding: ".5rem",
              }}
            >
              <TermCard
                index={index}
                Term={element}
                fetchPropuestas={fetchPropuestas}
              />
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

const TermCard = ({ Term, fetchPropuestas }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        color: "whitesmoke",
      }}
    >
      <div>
        <div>{Term.motivo}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <FcCalendar />
          {dayjs(Term.fecha_inicio).format("D-MMM")}
          <FaArrowRightLong />
          {dayjs(Term.fecha_fin).format("D-MMM")}
        </div>
      </div>

      <div>
        <OptionsMenu
          id={Term.id_propuesta}
          motivo={Term.motivo}
          fechaInicio={Term.fecha_inicio}
          fechaFin={Term.fecha_fin}
          disponiblesConsumidos={Term.disponibles_consumidos}
          nuevosConsumidos={Term.nuevos_consumidos}
          fetchSolicitudes={fetchPropuestas}
        />
      </div>
    </div>
  );
};
