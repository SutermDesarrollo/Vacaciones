import supabase from "../utils/supabaseClient";

//====================Aplicar Restricciones
export async function checkConstraints(user, motivo, diaInicio, diaFin) {
  const periodsConstraint = await checkMaxPeriods(user.RPE);

  if (!periodsConstraint) {
    return false;
  }

  return true;
}

//====================Restricciones
export async function checkMaxPeriods(rpe) {
  const { data, error } = await supabase
    .from("propuestas")
    .select()
    .eq("rpe_usuario", rpe);

  if (error) {
    return false;
  }

  if (data.length >= 4) {
    return false;
  }
  return true;
}

//====================Utils

export async function checkAvailableDays(rpe, diaInicio, diaFin) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("dias_disponibles")
    .eq("RPE", rpe)
    .single();

  if (error) {
    return false;
  }

  const requestedDays = calculateDateDifference(diaInicio, diaFin);

  if (requestedDays > data.dias_disponibles) {
    return false;
  }

  return true;
}

export function calculateDateDifference(fechaInicio, fechaFin) {
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);

  const differenceInMillis = end - start;

  // Convertir la diferencia a días (milisegundos por día = 1000 * 60 * 60 * 24)
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  if (differenceInDays < 0) {
    return false;
  }

  //Incluir ambos dias en el calculo
  return differenceInDays + 1;
}

export function checkperiodSize() {
  //<3 - cuenta a vacaciones
  //>4 -
}
