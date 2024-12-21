import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userLocalStorage";

export function updateDiasDisponiblesDiasNuevos(
  nuevosDiasDisponibles,
  nuevosDiasNuevos
) {
  const user = getUserFromLocalStorage();

  if (user) {
    //Cambios en localStorage
    user.dias_disponibles = nuevosDiasDisponibles;
    user.dias_nuevos = nuevosDiasNuevos;
    saveUserToLocalStorage(user);

    //Cambios en Estado de React
    return user;
  } else {
    console.log("No se encontro al usuario en el almacenamiento local");
  }
}
