import dayjs from "dayjs";
import supabase from "../utils/supabaseClient";
import toast from "react-hot-toast";

export async function revisarDisponibilidad(user, fechaInicio, fechaFin) {
  let inicio = dayjs(fechaInicio);
  let fin = dayjs(fechaFin);

  const maximaFaltantes = await getMaximaFaltantes(user.area);

  const propuestasEnArea = await getPropuestasEnArea(
    user.area,
    fechaInicio,
    fechaFin
  );

  const diasFestivos = await getDiasFestivos(fechaInicio, fechaFin);

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
function isFestividad(fecha, dias_festivos) {
  for (const festivo of dias_festivos) {
    if (dayjs(festivo.fecha).isSame(fecha)) {
      return true;
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

//================================================GETS

async function getMaximaFaltantes(user_area) {
  const { data, error } = await supabase
    .from("areas")
    .select()
    .eq("nombre", user_area)
    .single();

  if (data) {
    let maximaFaltantes = 1;
    if (data.cantidad_trabajadores > 2) {
      maximaFaltantes = Math.round(data.cantidad_trabajadores * 0.2);
    }

    return maximaFaltantes;
  }
}

async function getPropuestasEnArea(user_area, fechaInicio, fechaFin) {
  let propuestas = [];
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("RPE")
      .eq("area", user_area)
      .eq("registro_vacaciones", true);
    if (error) {
      throw new Error("Error en BD");
    }
    //data son los usuarios del area que ya registraron vacaciones
    if (data) {
      for (const usuario of data) {
        const { data, error } = await supabase
          .from("propuestas")
          .select()
          .eq("rpe_usuario", usuario.RPE)
          .gte("fecha_fin", fechaInicio)
          .lte("fecha_inicio", fechaFin);
        if (error) {
          console.log(error);
        }
        if (data) {
          propuestas = propuestas.concat(data);
        }
      }
      return propuestas;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getDiasFestivos(fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from("dias_festivos")
    .select()
    .gte("fecha", fechaInicio)
    .lte("fecha", fechaFin);

  if (error) {
    console.log(error);
  }
  if (data) {
    return data;
  }
}
