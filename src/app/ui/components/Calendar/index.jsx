"use client ";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
dayjs.locale("es");

const localizer = dayjsLocalizer(dayjs);

function CalendarComponent({ dataCalendar }) {
  const [eventos, setEventos] = useState(dataCalendar);
  useEffect(() => {
    if (dataCalendar) {
      setEventos(dataCalendar);
    }
  }, [dataCalendar]);

  const components = {
    event: (props) => {
      const { data } = props.event;
      if (data.self) {
        return (
          <div
            className="custom-event"
            style={{ backgroundColor: "#745cd0" }}
          ></div>
        );
      } else {
        return (
          <div
            className="custom-event"
            style={{ backgroundColor: "#fd9e35" }}
          ></div>
        );
      }
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "1rem",
        height: "450px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { md: "space-around" },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <div
            style={{
              height: "1rem",
              width: "1rem",
              borderRadius: "4px",
              backgroundColor: "#745cd0",
            }}
          ></div>
          <Typography>Tus Propuestas</Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <div
            style={{
              height: "1rem",
              width: "1rem",
              borderRadius: "4px",
              backgroundColor: "#fd9e35",
            }}
          ></div>
          <Typography>Propuestas del Departamento</Typography>
        </div>
      </Box>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        views={["month", "day"]}
        components={components}
      />
    </div>
  );
}

export default CalendarComponent;
