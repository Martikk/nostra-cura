// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import SitemapPlugin from "vite-plugin-sitemap";
// import compression from "vite-plugin-compression"; // ← нужно, только если хочешь .gz/.br ассеты

export default defineConfig({
  plugins: [
    react(),
    SitemapPlugin({
      hostname: "https://nostracura.ca",
      dynamicRoutes: ["/", "/liam"],
      changefreq: "weekly",
      priority: 0.8,
      // generateRobotsTxt включён по умолчанию (true), можно явно указать:
      // generateRobotsTxt: true,
      // exclude: ["/admin", "/private"], // при необходимости
    }),
    // compression({ algorithm: "gzip" }), // ← если нужен gzip ассетов (НЕ sitemap), опционально
  ],
});