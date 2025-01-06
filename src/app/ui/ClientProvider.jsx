"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import DashboardLayout from "./layout/DashboardLayout";
import { useState, createContext, useContext } from "react";

const SiteContext = createContext();

export const SiteData = () => useContext(SiteContext);

function ClientProvider({ children }) {
  const [userReact, setUserReact] = useState(null);

  return (
    <SiteContext.Provider value={{ userReact, setUserReact }}>
      <AppRouterCacheProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AppRouterCacheProvider>
    </SiteContext.Provider>
  );
}

export default ClientProvider;
