import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
const root = document.getElementById("root")!;
const app = (
  <App language={/\/zh(?:\/|$)/.test(location.pathname) ? "zh" : "en"} />
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
