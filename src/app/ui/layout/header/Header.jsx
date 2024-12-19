import { AppBar, Button, Link, Toolbar } from "@mui/material";
import Logo from "../../../../../public/SutermLogo.png";
import Image from "next/image";
import { removeUserFromLocalStorage } from "../../../utils/userLocalStorage";
import { SiteData } from "../../ClientProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Header() {
  const { userState, setUserState } = SiteData();

  const router = useRouter();

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUserState(null);
    toast.success("Cerrando Sesion");
    router.push("/");
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
        {userState ? <div>{userState.nombre}</div> : null}
        {userState ? <Button onClick={handleLogout}>Logout</Button> : null}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
