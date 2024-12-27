"use client"
import { AppBar, Button, Link, Toolbar } from "@mui/material";
import Logo from "../../../../../public/SutermLogo.png";
import Image from "next/image";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../../utils/userLocalStorage";
import { SiteData } from "../../ClientProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Header() {
  const { userState, setUserState } = SiteData();

  const router = useRouter();

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUserState(null);
    toast.success("Cerrando Sesion");
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    setUserState(getUserFromLocalStorage());
  }, []);

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
        {userState ? (
          <div style={{ textAlign: "center" }}>{userState.nombre}</div>
        ) : null}
        {userState ? (
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
