import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initThemeMode } from "flowbite-react"; 
import AppRoutes from "./Routes";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <AppRoutes /> 
    </StrictMode>,
  );
}

initThemeMode();
