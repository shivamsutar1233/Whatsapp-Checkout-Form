import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    // base: "./",
    // build: {
    //   outDir: "dist",
    //   assetsDir: "assets",
    //   sourcemap: true,
    // },
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: env.VITE_API_URL, // 👈 backend server
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, "/api"),
    //     },
    //   },
    // },
  };
});
