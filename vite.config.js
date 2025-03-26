import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import importToCDN from "vite-plugin-cdn-import";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    visualizer({
      open: true, // 构建完成后自动打开报告
      filename: "stats.html", // 输出文件名
    }),
    importToCDN({
      modules: [
        {
          name: "react",
          var: "React",
          path: "https://unpkg.com/react@18/umd/react.production.min.js",
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        },
      ],
    }),
  ],
  server: {
    host: "127.0.0.1",
    open: true,
  },
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        manualChunks(id) {
          if (id.includes("antd/es/table")) {
            return "antd_es_table";
          }
          if (id.includes("table")) {
            return "table";
          }
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
