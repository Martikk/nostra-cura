import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react(), {
 name: "prerendered-preview-routes",
 configurePreviewServer(server) {
  server.middlewares.use((req, res, next) => {
   const path = req.url?.split("?")[0];
   if (path === "/liam" || path === "/liam/") req.url = "/liam/index.html";
   else if (path && path !== "/" && !path.includes(".")) { req.url = "/404.html"; res.statusCode = 404; }
   next();
  });
 }
}] });
