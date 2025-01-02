"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import DashboardLayout from "./layout/DashboardLayout";
import { useState, createContext, useContext } from "react";

const SiteContext = createContext();

export const SiteData = () => useContext(SiteContext);

function ClientProvider({ children }) {
  const [userState, setUserState] = useState(null);

  return (
    <SiteContext.Provider value={{ userState, setUserState }}>
      <AppRouterCacheProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AppRouterCacheProvider>
    </SiteContext.Provider>
  );
}

export default ClientProvider;
