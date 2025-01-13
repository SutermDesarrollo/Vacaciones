"use client";
import { useState } from "react";
import { cerrarRegistro } from "../../agenda/functions/dbQueries";
import { getUserFromLocalStorage } from "../../utils/userLocalStorage";
import { Box, Button, Modal, Typography } from "@mui/material";
import toast from "react-hot-toast";

function CerrarRegistro({ disabled }) {
  const [open, setOpen] = useState(false);

  const handleCerrarRegistro = async () => {
    const user = getUserFromLocalStorage();

    await cerrarRegistro(user.RPE);
    toast.success("Se cerro tu registro correctamente");
    router.push("/");
  };

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        fullWidth={true}
        onClick={() => setOpen(true)}
        sx={{ backgroundColor: "#1565c0" }}
      >
        Cerrar Registro
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
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
            textAlign: "center",
          }}
        >
          <Typography>
            ¿Cerrar el registro? Una vez cerrado no podrás hacer más acciones
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
            }}
          >
            <Button
              variant="outlined"
              style={{ flexGrow: 1 }}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              style={{ flexGrow: 1 }}
              onClick={handleCerrarRegistro}
            >
              Cerrar
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default CerrarRegistro;
