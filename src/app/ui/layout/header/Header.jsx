"use client";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Logo from "../../../../../public/SutermLogo.png";
import Image from "next/image";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../../utils/userLocalStorage";
import { SiteData } from "../../ClientProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const { userReact, setUserReact } = SiteData();

  const router = useRouter();

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUserReact(null);
    handleClose();
    toast.success("Cerrando Sesion");
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    setUserReact(getUserFromLocalStorage());
  }, []);

  // -- Menu Popover -----------------------------------

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      sx={{
        position: "sticky",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#303030",
        }}
      >
        <a href="/">
          <Image
            src={Logo}
            style={{ height: "2rem", width: "auto" }}
            alt="Suterm"
          />
        </a>

        {userReact ? (
          <>
            <IconButton
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ color: "whitesmoke" }}
            >
              <FaCircleUser />
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
              <MenuItem style={{ whiteSpace: "normal" }}>
                <Typography>{userReact.nombre}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid red",
                    borderRadius: "4px",
                    color: "red",
                  }}
                >
                  <FiLogOut style={{ verticalAlign: "bottom" }} />
                  <Typography>Cerrar Sesión</Typography>
                </div>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
