import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KeysDemo } from "./KeysDemo";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing #root element in keys-demo.html");

createRoot(rootElement).render(
  <StrictMode>
    <KeysDemo />
  </StrictMode>
);
