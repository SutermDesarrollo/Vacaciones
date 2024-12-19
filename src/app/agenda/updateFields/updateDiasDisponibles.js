import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userLocalStorage";

export function updateDiasDisponibles(nuevosDiasDisponibles) {
  const user = getUserFromLocalStorage();

  if (user) {
    //Cambios en localStorage
    user.dias_disponibles = nuevosDiasDisponibles;
    saveUserToLocalStorage(user);

    //Cambios en Estado de React
    return user;
  } else {
    console.log("No se encontro al usuario en el almacenamiento local");
  }
}
