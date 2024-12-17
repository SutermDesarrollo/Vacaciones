"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DashboardLayout from "./layout/DashboardLayout";
import { useState, createContext, useContext } from "react";
import {
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../utils/userLocalStorage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SiteContext = createContext();

export const SiteData = () => useContext(SiteContext);

function ClientProvider({ children }) {
  const router = useRouter();

  const handleLogin = (userData) => {
    saveUserToLocalStorage(userData);
    toast.success("Usuario encontrado");
    router.push("/");
  };

  const handleLogout = () => {
    removeUserFromLocalStorage();
    toast.success("Cerrando Sesion");
    router.refresh();
    router.push("/");
  };

  return (
    <SiteContext.Provider value={{ handleLogin, handleLogout }}>
      <AppRouterCacheProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DashboardLayout>{children}</DashboardLayout>
        </LocalizationProvider>
      </AppRouterCacheProvider>
    </SiteContext.Provider>
  );
}

export default ClientProvider;
