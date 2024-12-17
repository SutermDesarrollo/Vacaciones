"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DashboardLayout from "./layout/DashboardLayout";

function ClientProvider({ children }) {
  return (
    <AppRouterCacheProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DashboardLayout>{children}</DashboardLayout>
      </LocalizationProvider>
    </AppRouterCacheProvider>
  );
}

export default ClientProvider;
