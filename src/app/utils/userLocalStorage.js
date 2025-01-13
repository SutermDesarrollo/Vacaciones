// Función para guardar el usuario en el localStorage
export const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Función para obtener el usuario desde el localStorage
export const getUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    return user;
  }
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};
