import supabase from "../utils/supabaseClient";

export async function checkConstraints(user, motivo, diaInicio, diaFin) {
  //===============Revisar si no ha llegado al limite de periodos
  const periodsConstraint = await checkMaxPeriods(user.RPE);

  //===============Revisar si el periodo cabe en los dias disponibles
  const availableConstraint = await checkAvailableDays(
    user.RPE,
    diaInicio,
    diaFin
  );

  //===============Si alguna restriccion da false, regresa false
  if (!periodsConstraint || !availableConstraint) {
    return false;
  }

  //===============Si pasa las restricciones, regresa true
  return true;
}

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

export function checkperiodSize() {
  //<3 - cuenta a vacaciones
  //>4 -
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
