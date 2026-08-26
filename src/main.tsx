import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";

const root = document.getElementById("root")!;
if (import.meta.env.DEV) {
  const className = root.className;
  root.className = [...className.split(" "), "debug"].join(" ");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
