import supabase from "../utils/supabaseClient";

export async function siguienteEnLineaPorArea(area) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("RPE,nombre,area,antiguedad,registro_vacaciones")
    .eq("area", area)
    .eq("registro_vacaciones", false)
    .order("antiguedad", { ascending: true });

  if (error) {
    return error;
  }

  return data.at(0);
}

export async function cerrarRegistro(RPE) {
  const { error } = await supabase
    .from("usuarios")
    .update({ registro_vacaciones: true })
    .eq("RPE", RPE);

  if (error) {
    console.log(error);
  }
}
