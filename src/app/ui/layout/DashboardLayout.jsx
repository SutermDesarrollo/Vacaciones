import { Box } from "@mui/material";
import Header from "./header/Header";
import { Toaster } from "react-hot-toast";

function DashboardLayout({ children }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Toaster
          toastOptions={{
            style: {
              textAlign: "center",
            },
          }}
        />
        {children}
      </Box>
    </>
  );
}

export default DashboardLayout;
