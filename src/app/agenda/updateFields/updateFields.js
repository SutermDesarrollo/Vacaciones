import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userLocalStorage";

export function updateDiasDisponiblesDiasNuevos(
  nuevosDiasDisponibles,
  nuevosDiasNuevos,
  nuevosDiasSolicitados
) {
  const user = getUserFromLocalStorage();

  if (user) {
    //Cambios en localStorage
    user.dias_disponibles = nuevosDiasDisponibles;
    user.dias_nuevos = nuevosDiasNuevos;
    user.dias_solicitados = nuevosDiasSolicitados;
    saveUserToLocalStorage(user);

    //Cambios en Estado de React
    return user;
  } else {
    console.log("No se encontro al usuario en el almacenamiento local");
  }
}
