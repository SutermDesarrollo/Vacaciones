import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { PiDotsThreeCircleVertical } from "react-icons/pi";
import { RiEdit2Line, RiDeleteBin5Line } from "react-icons/ri";
import supabase from "../../utils/supabaseClient";
import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userLocalStorage";
import { SiteData } from "../ClientProvider";
import toast from "react-hot-toast";

export default function OptionsMenu({ id, fetchSolicitudes }) {
  const { setUserState } = SiteData();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditar = (id) => {
    alert(`(Pendiente) Editar id: ${id}`);
    handleClose();
  };

  const handleEliminar = async (id) => {
    handleClose();
    //Recuperar antes de eliminar
    const { data, error } = await supabase
      .from("propuestas")
      .select()
      .eq("id_propuesta", id)
      .single();
    if (error) {
      console.log(error);
    }

    //Eliminar
    const response = await supabase
      .from("propuestas")
      .delete()
      .eq("id_propuesta", id);

    //Actualizar campos
    const user = getUserFromLocalStorage();
    user.dias_solicitados =
      user.dias_solicitados -
      data.disponibles_consumidos -
      data.nuevos_consumidos;
    user.dias_disponibles = user.dias_disponibles + data.disponibles_consumidos;
    user.dias_nuevos = user.dias_nuevos + data.nuevos_consumidos;
    saveUserToLocalStorage(user);
    setUserState(user);

    //Actualizar BD
    const { error: updateError } = await supabase
      .from("usuarios")
      .update({
        dias_disponibles: user.dias_disponibles,
        dias_nuevos: user.dias_nuevos,
        dias_disponibles: user.dias_disponibles,
      })
      .eq("RPE", user.RPE);

    //Actualizar lista y notificar
    fetchSolicitudes();
    toast.success("Propuesta eliminada");
  };

  return (
    <div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "whitesmoke" }}
      >
        <PiDotsThreeCircleVertical />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => handleEditar(id)}>
          <RiEdit2Line /> Editar
        </MenuItem>
        <MenuItem onClick={() => handleEliminar(id)}>
          <RiDeleteBin5Line />
          Eliminar
        </MenuItem>
      </Menu>
    </div>
  );
}
