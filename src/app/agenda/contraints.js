import toast from "react-hot-toast";
import supabase from "../utils/supabaseClient";
import {
  auxDiasFestivos,
  auxTipoRol,
  calcularDiasPorDescontar,
} from "./insertVacation";

//====================Aplicar Restricciones
export async function revisarPeriodos(user, motivo, fechaInicio, fechaFin) {
  if (motivo == "Dias a Cuenta de Vacaciones") {
    const tipoRol = await auxTipoRol(user.area);
    const diasFestivos = await auxDiasFestivos(fechaInicio, fechaFin);
    const diasPorDescontar = await calcularDiasPorDescontar(
      fechaInicio,
      fechaFin,
      tipoRol,
      diasFestivos
    );
    if (diasPorDescontar < 4) {
      return true;
    } else {
      toast.error(
        "Para contar como Dias a Cuenta de Vacaciones, el periodo tiene que tener menos de 4 dias laborales"
      );
      return false;
    }
  }

  const periodsConstraint = await checkMaxPeriods(user.RPE);

  if (!periodsConstraint) {
    toast.error("No puedes registrar más de 4 periodos", {
      id: "error",
    });
    return false;
  }

  return true;
}

//====================Restricciones
export async function checkMaxPeriods(rpe) {
  const { data, error } = await supabase
    .from("propuestas")
    .select()
    .eq("rpe_usuario", rpe)
    .eq("tipo", "Periodo");

  if (error) {
    return false;
  }

  if (data.length >= 4) {
    return false;
  }
  return true;
}
