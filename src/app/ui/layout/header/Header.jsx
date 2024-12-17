import { AppBar, Button, Link, Toolbar } from "@mui/material";
import Logo from "../../../../../public/SutermLogo.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../../../utils/userLocalStorage";
import { SiteData } from "../../ClientProvider";

function Header() {
  const { handleLogout } = SiteData();
  const [user, setUser] = useState("");
  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      setUser(user);
    }
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
        {user ? <div>{user.nombre}</div> : null}
        {user ? <Button onClick={handleLogout}>Logout</Button> : null}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
