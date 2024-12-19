"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DashboardLayout from "./layout/DashboardLayout";
import { useState, createContext, useContext } from "react";

const SiteContext = createContext();

export const SiteData = () => useContext(SiteContext);

function ClientProvider({ children }) {
  const [userState, setUserState] = useState(null);

  return (
    <SiteContext.Provider value={{ userState, setUserState }}>
      <AppRouterCacheProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DashboardLayout>{children}</DashboardLayout>
        </LocalizationProvider>
      </AppRouterCacheProvider>
    </SiteContext.Provider>
  );
}

export default ClientProvider;
