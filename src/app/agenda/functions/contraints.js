import toast from "react-hot-toast";
import { calcularDiasPorDescontar } from "./insertVacation";
import { auxDiasFestivos, auxTipoRol, maximoPeriodos } from "./dbQueries";

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

  const periodsConstraint = await maximoPeriodos(user.RPE);

  if (!periodsConstraint) {
    toast.error("No puedes registrar más de 4 periodos", {
      id: "error",
    });
    return false;
  }

  return true;
}
