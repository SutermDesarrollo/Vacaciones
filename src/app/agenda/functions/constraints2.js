import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  auxDiasFestivos,
  auxMaximaFaltantes,
  auxPropuestasEnArea,
} from "./dbQuerys/dbEntries";

export async function revisarDisponibilidad(user, fechaInicio, fechaFin) {
  let inicio = dayjs(fechaInicio);
  let fin = dayjs(fechaFin);

  const maximaFaltantes = await auxMaximaFaltantes(user.area);

  const propuestasEnArea = await auxPropuestasEnArea(
    user.area,
    fechaInicio,
    fechaFin
  );

  const diasFestivos = await auxDiasFestivos(fechaInicio, fechaFin);

  let isDisponible = true;
  while (inicio <= fin) {
    if (!isFestividad(inicio, diasFestivos)) {
      if (!isDescanso(inicio)) {
        let propuestasEnDia = 0;
        for (const propuesta of propuestasEnArea) {
          let propuestaInicio = dayjs(propuesta.fecha_inicio);
          let propuestaFin = dayjs(propuesta.fecha_fin);

          while (propuestaInicio <= propuestaFin) {
            if (propuestaInicio.isSame(inicio)) {
              propuestasEnDia = propuestasEnDia + 1;
            }
            propuestaInicio = propuestaInicio.add(1, "day");
          }
        }
        if (propuestasEnDia >= maximaFaltantes) {
          toast.error(
            "Solicitud rechazada por disponibilidad en el departamento",
            { id: "error" }
          );
          isDisponible = false;
        }
      }
    }

    inicio = inicio.add(1, "day");
  }

  return isDisponible;
}

//================================================VALIDACION
export function isFestividad(fecha, dias_festivos) {
  if (dias_festivos.length > 0) {
    for (const festivo of dias_festivos) {
      if (dayjs(festivo.fecha).isSame(fecha)) {
        return true;
      }
    }
  }

  return false;
}

function isDescanso(fecha) {
  if (fecha.day() === 6 || fecha.day() === 0) {
    return true;
  }
  return false;
}
