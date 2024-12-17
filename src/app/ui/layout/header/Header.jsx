import { AppBar, Button, Toolbar } from "@mui/material";
import Logo from "../../../../../public/SutermLogo.png";
import Image from "next/image";

function Header() {
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
        <Image
          src={Logo}
          style={{ height: "2rem", width: "auto" }}
          alt="Suterm"
        />
        <Button>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
