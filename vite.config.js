import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    open: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
