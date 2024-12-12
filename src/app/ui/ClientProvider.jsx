"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function ClientProvider({ children }) {
  return (
    <AppRouterCacheProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </AppRouterCacheProvider>
  );
}

export default ClientProvider;
