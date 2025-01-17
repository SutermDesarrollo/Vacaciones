import supabase from "../../utils/supabaseClient";
import { isFestividad } from "./constraints2";
import { updateDiasDisponiblesDiasNuevos } from "./updateFields";

import dayjs from "dayjs";
import { auxDiasFestivos, auxTipoRol } from "./dbQueries";

export async function calcularDiasPorDescontar(
  fechaInicio,
  fechaFin,
  tipoRol,
  diasFestivos
) {
  let diasRestantes = [];

  // Convertimos las fechas a objetos Date
  let inicio = dayjs(fechaInicio);
  let fin = dayjs(fechaFin);

  // Recorremos el rango de fechas
  while (inicio <= fin) {
    let diaSemana = inicio.day(); // Obtiene el día de la semana (0 = domingo, 6 = sábado)

    // Verificamos si es un día festivo o de descanso
    const esFestivo = await isFestividad(inicio, diasFestivos);

    let esDescanso = false;
    if (tipoRol == 1) {
      if (diaSemana === 6 || diaSemana === 0) {
        esDescanso = true;
      }
    }

    // Si no es festivo ni de descanso, lo agregamos al conteo de días
    if (!esFestivo && !esDescanso) {
      diasRestantes.push(inicio);
    }

    // Pasamos al siguiente día
    inicio = inicio.add(1, "day");
  }

  return diasRestantes.length;
}

export async function insertarPropuesta(user, motivo, fechaInicio, fechaFin) {
  try {
    const { diasDescontadosDeDisponibles, diasDescontadosDeNuevos } =
      await calcularDiasNuevosDiasDisponibles(user, fechaInicio, fechaFin);

    //==========Insertar en tabla propuestas
    const { error: insertError } = await supabase.from("propuestas").insert({
      motivo: motivo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      rpe_usuario: user.RPE,
      disponibles_consumidos: diasDescontadosDeDisponibles,
      nuevos_consumidos: diasDescontadosDeNuevos,
      tipo:
        motivo == "Dias a Cuenta de Vacaciones"
          ? "Cuenta de Vacaciones"
          : "Periodo",
    });
    if (insertError) {
      throw new Error({ message: "Error en BD" });
    }

    //=========Actualizar dias disponibles
    const { error: updateError } = await supabase
      .from("usuarios")
      .update({
        dias_disponibles: user.dias_disponibles - diasDescontadosDeDisponibles,
        dias_nuevos: user.dias_nuevos - diasDescontadosDeNuevos,
        dias_solicitados:
          user.dias_solicitados +
          diasDescontadosDeDisponibles +
          diasDescontadosDeNuevos,
      })
      .eq("RPE", user.RPE);

    if (updateError) {
      throw new Error({ message: "Error en BD" });
    }
    const updatedUser = updateDiasDisponiblesDiasNuevos(
      user.dias_disponibles - diasDescontadosDeDisponibles,
      user.dias_nuevos - diasDescontadosDeNuevos,
      user.dias_solicitados +
        diasDescontadosDeDisponibles +
        diasDescontadosDeNuevos
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export async function calcularDiasNuevosDiasDisponibles(
  user,
  fechaInicio,
  fechaFin
) {
  try {
    const tipoRol = await auxTipoRol(user.area);

    const diasFestivos = await auxDiasFestivos(fechaInicio, fechaFin);

    const diasPorDescontar = await calcularDiasPorDescontar(
      fechaInicio,
      fechaFin,
      tipoRol,
      diasFestivos
    );

    let diasRestantes = diasPorDescontar;
    let diasDescontadosDeDisponibles = 0;
    let diasDescontadosDeNuevos = 0;

    //============Tratar de descontar con disponibles
    if (user.dias_disponibles >= diasRestantes) {
      diasDescontadosDeDisponibles = diasRestantes;
      diasRestantes = 0;
    } else {
      diasDescontadosDeDisponibles = user.dias_disponibles;
      diasRestantes = diasRestantes - user.dias_disponibles;
    }

    //============Tratar de descontar con nuevos, si quedan
    if (diasRestantes > 0) {
      //Revisar si el periodo solicitado se encuentra antes de la fecha de antiguedad
      let fechaLimiteDiasNuevos = dayjs(user.antiguedad).year(2025);
      if (dayjs(fechaFin).isBefore(fechaLimiteDiasNuevos)) {
        if (user.dias_nuevos >= diasRestantes) {
          diasDescontadosDeNuevos = diasRestantes;
          diasRestantes = 0;
        } else {
          diasDescontadosDeNuevos = user.dias_nuevos;
          diasRestantes = diasRestantes - user.dias_nuevos;
        }
      } else {
        throw new Error(
          "No puedes usar dias nuevos despues de tu fecha de entrada"
        );
      }
    }

    //Verificar si quedan dias no descontados
    if (diasRestantes > 0) {
      throw new Error(
        "No tienes suficientes días disponibles ni días nuevos para cubrir esta solicitud"
      );
    }

    return { diasDescontadosDeDisponibles, diasDescontadosDeNuevos };
  } catch (error) {
    throw error;
  }
}
