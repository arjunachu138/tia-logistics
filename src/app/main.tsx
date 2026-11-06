import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryclient.ts";
import { ToastProvider } from "../components/toast/ToastProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
       <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
