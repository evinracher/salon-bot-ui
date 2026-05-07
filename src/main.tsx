
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { Toaster } from "./app/components/ui/sonner";
import { queryClient } from "./lib/queryClient";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>,
);
  