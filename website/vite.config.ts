import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  base: process.env.SITE_BASE || "/",
  plugins: [react(), tailwindcss()],
});
