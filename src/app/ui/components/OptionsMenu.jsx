import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
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

import DateTimePicker from "../forms/DateTimePicker";
import Button from "../forms/Button";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { validaciones } from "../../agenda/functions/validaciones";
import { insertarPropuesta } from "../../agenda/functions/insertVacation";

export default function OptionsMenu({
  id,
  motivo,
  fechaInicio,
  fechaFin,
  disponiblesConsumidos,
  nuevosConsumidos,
  fetchSolicitudes,
}) {
  // -- Yup Validation --------------------------------------------------------
  const INITIAL_FORM_STATE = {
    motivo: motivo,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
  };

  const FORM_VALIDATION = Yup.object().shape({
    motivo: Yup.string().required("Requerido"),
    fechaInicio: Yup.date().required("Requerido"),
    fechaFin: Yup.date()
      .min(Yup.ref("fechaInicio"), "Dia Fin no puede ser antes de Dia Inicio")
      .required("Requerido"),
  });

  const { setUserReact } = SiteData();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    setUserReact(user);

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

  //== Modal State ==========================================================
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //== HandleSubmit =========================================================

  const handleSubmit = async ({ motivo, fechaInicio, fechaFin }) => {
    const response = await supabase
      .from("propuestas")
      .delete()
      .eq("id_propuesta", id);

    //Regresar valores numericos
    const user = getUserFromLocalStorage();
    user.dias_solicitados =
      user.dias_solicitados - disponiblesConsumidos - nuevosConsumidos;
    user.dias_disponibles = user.dias_disponibles + disponiblesConsumidos;
    user.dias_nuevos = user.dias_nuevos + nuevosConsumidos;
    saveUserToLocalStorage(user);
    setUserReact(user);

    //Insertar
    const esValido = await validaciones(user, motivo, fechaInicio, fechaFin);
    if (esValido) {
      try {
        const updatedUser = await insertarPropuesta(
          user,
          motivo,
          fechaInicio,
          fechaFin
        );
        setUserReact(updatedUser);
        toast.success("Propuesta Editada");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }

    setOpenModal(false);
    fetchSolicitudes();
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
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <RiEdit2Line />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleEliminar(id)}>
          <RiDeleteBin5Line />
          Eliminar
        </MenuItem>
      </Menu>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: { xs: "90%", sm: "50%" },
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "4px",
            boxShadow: 24,
          }}
        >
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleSubmit}
          >
            <Form
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Typography>{motivo}</Typography>
              <DateTimePicker name="fechaInicio" label="Dia Inicio" />
              <DateTimePicker name="fechaFin" label="Dia fin" />
              <Button>Editar</Button>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
