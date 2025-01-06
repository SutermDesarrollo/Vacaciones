import { revisarDisponibilidad } from "./constraints2";
import { revisarPeriodos } from "./contraints";

export async function validaciones(user, motivo, fechaInicio, fechaFin) {
  const periodoValido = await revisarPeriodos(
    user,
    motivo,
    fechaInicio,
    fechaFin
  );

  const EsDisponible = await revisarDisponibilidad(user, fechaInicio, fechaFin);

  if (periodoValido && EsDisponible) {
    return true;
  }
  return false;
}
