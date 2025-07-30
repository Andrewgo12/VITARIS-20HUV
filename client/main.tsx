import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

// Prevent multiple root creation during HMR
const container = document.getElementById("root")!;
if (!(container as any)._reactRoot) {
  const root = createRoot(container);
  (container as any)._reactRoot = root;
  root.render(<App />);
} else {
  (container as any)._reactRoot.render(<App />);
}
