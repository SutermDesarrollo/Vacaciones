import supabase from "../utils/supabaseClient";
import { calculateDateDifference } from "./contraints";
import { updateDiasDisponibles } from "./updateFields/updateFields";

export async function insertVacation(user, motivo, fechaInicio, fechaFin) {
  //==========Calcular dias que se restaran al campo dias_disponibles
  const vacationDays = await calculateVacationDays(fechaInicio, fechaFin);

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
    .update({ dias_disponibles: user.dias_disponibles - vacationDays })
    .eq("RPE", user.RPE);

  if (updateError) {
    console.log(updateError);
  }
  const updatedUser = updateDiasDisponibles(
    user.dias_disponibles - vacationDays
  );
  return updatedUser;
}

export async function getFestivosInRange(fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from("dias_festivos")
    .select()
    .gte("fecha", fechaInicio)
    .lte("fecha", fechaFin);

  if (error) {
    throw new Error("Error al obtener dias festivos");
  }

  return data.length;
}

async function calculateVacationDays(fechaInicio, fechaFin) {
  //Numero de dias en el periodo
  const termCount = calculateDateDifference(fechaInicio, fechaFin);

  //Numero de Festividades en el periodo
  const holidaysCount = await getFestivosInRange(fechaInicio, fechaFin);

  //Numero de dias de vacaciones | Estas se descuentan de "dias_disponibles"
  const vacationDays = termCount - holidaysCount;

  return vacationDays;
}
