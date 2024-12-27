import toast from "react-hot-toast";
import supabase from "../utils/supabaseClient";

//====================Aplicar Restricciones
export async function revisarPeriodos(user) {
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
    .eq("rpe_usuario", rpe);

  if (error) {
    return false;
  }

  if (data.length >= 4) {
    return false;
  }
  return true;
}
