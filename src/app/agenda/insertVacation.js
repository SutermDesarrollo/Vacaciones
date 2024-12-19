import supabase from "../utils/supabaseClient";
import { updateDiasDisponibles } from "./updateFields/updateFields";

import dayjs from "dayjs";

export async function calcularDiasDescontados(
  fechaInicio,
  fechaFin,
  tipoRol,
  diasFestivos
) {
  const diasRestantes = [];

  // Convertimos las fechas a objetos Date
  let inicio = dayjs(fechaInicio);
  let fin = dayjs(fechaFin);

  // Recorremos el rango de fechas
  while (inicio <= fin) {
    const diaSemana = inicio.day(); // Obtiene el día de la semana (0 = domingo, 6 = sábado)

    // Verificamos si es un día festivo o de descanso
    const esFestivo = diasFestivos.some((festivo) =>
      dayjs(festivo.fecha).isSame(inicio, "day")
    );

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

async function auxTipoRol(area) {
  const { data, error } = await supabase
    .from("areas")
    .select()
    .eq("nombre", area)
    .single();

  if (error) {
    console.log(error);
  }

  return data.rol_tipo;
}

async function auxDiasFestivos() {
  const { data, error } = await supabase
    .from("dias_festivos")
    .select()
    .order("fecha", { ascending: true });

  if (error) {
    console.log(error);
  }
  return data;
}

export async function insertNewVacation(user, motivo, fechaInicio, fechaFin) {
  const tipoRol = await auxTipoRol(user.area);

  const diasFestivos = await auxDiasFestivos();

  const diasDescontados = await calcularDiasDescontados(
    fechaInicio,
    fechaFin,
    tipoRol,
    diasFestivos
  );

  //==========Insertar en tabla propuestas
  const { error: insertError } = await supabase.from("propuestas").insert({
    motivo: motivo,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    rpe_usuario: user.RPE,
  });
  if (insertError) {
    console.log(insertError);
  }

  //=========Actualizar dias disponibles
  const { error: updateError } = await supabase
    .from("usuarios")
    .update({ dias_disponibles: user.dias_disponibles - diasDescontados })
    .eq("RPE", user.RPE);

  if (updateError) {
    console.log(updateError);
  }
  const updatedUser = updateDiasDisponibles(
    user.dias_disponibles - diasDescontados
  );
  return updatedUser;
}
