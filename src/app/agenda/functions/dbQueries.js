import supabase from "../../utils/supabaseClient";

// -- Usuario del area en turno de registro  --------------------------------

export async function siguienteEnLineaPorArea(user_area) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("RPE,nombre,area,antiguedad,registro_vacaciones")
    .eq("area", user_area)
    .eq("registro_vacaciones", false)
    .order("antiguedad", { ascending: true });

  if (error) {
    return error;
  }

  return data.at(0);
}

// -- Cerrar Registro de Usuario --------------------------------------------

export async function cerrarRegistro(user_RPE) {
  const { error } = await supabase
    .from("usuarios")
    .update({ registro_vacaciones: true })
    .eq("RPE", user_RPE);

  if (error) {
    console.log(error);
  }
}

// -- Numero de rol de descanso correspondiente al area de un usuario (1|2)--

export async function auxTipoRol(user_area) {
  try {
    const { data, error } = await supabase
      .from("areas")
      .select()
      .eq("nombre", user_area)
      .single();

    if (error) {
      throw new Error({ message: "Error en BD" });
    }

    return data.rol_tipo;
  } catch (error) {
    throw error;
  }
}

// -- Arreglo de Dias festivos en rango de fechas ---------------------------

export async function auxDiasFestivos(fechaInicio, fechaFin) {
  try {
    const { data, error } = await supabase
      .from("dias_festivos")
      .select()
      .gte("fecha", fechaInicio)
      .lte("fecha", fechaFin);
    if (error) {
      throw new Error({ message: "Error en BD" });
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// -- Numero maximo de personas que puede faltar en el area -----------------

export async function auxMaximaFaltantes(user_area) {
  const { data, error } = await supabase
    .from("areas")
    .select()
    .eq("nombre", user_area)
    .single();

  if (data) {
    let maximaFaltantes = 1;
    if (data.cantidad_trabajadores > 2) {
      maximaFaltantes = Math.round(data.cantidad_trabajadores * 0.2);
    }

    return maximaFaltantes;
  }
}

// -- Arreglo de Propuestas existentes en area del usuario ------------------

export async function auxPropuestasEnArea(user_area, fechaInicio, fechaFin) {
  let propuestas = [];
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("RPE")
      .eq("area", user_area)
      .eq("registro_vacaciones", true);
    if (error) {
      throw new Error("Error en BD");
    }
    //data son los usuarios del area que ya registraron vacaciones
    if (data) {
      for (const usuario of data) {
        const { data, error } = await supabase
          .from("propuestas")
          .select()
          .eq("rpe_usuario", usuario.RPE)
          .gte("fecha_fin", fechaInicio)
          .lte("fecha_inicio", fechaFin);
        if (error) {
          console.log(error);
        }
        if (data) {
          propuestas = propuestas.concat(data);
        }
      }
      return propuestas;
    }
  } catch (error) {
    console.log(error);
  }
}

// -- Boolean Para el numero de Periodos (Max 4) ----------------------------

export async function maximoPeriodos(rpe) {
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
