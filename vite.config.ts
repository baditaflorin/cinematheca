import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.VITE_APP_BASE ?? "/cinematheca/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["build-info.json"],
      manifest: {
        name: "Cinematheca",
        short_name: "Cinematheca",
        description: "Local-first post-production toolkit for independent cinema.",
        theme_color: "#1f1b17",
        background_color: "#1f1b17",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,json,webmanifest}"],
        navigateFallback: `${base}index.html`
      }
    })
  ],
  build: {
    outDir: "docs",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@ffmpeg")) {
            return "engine-ffmpeg";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
          return undefined;
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0"),
    __REPOSITORY_URL__: JSON.stringify(
      process.env.VITE_REPOSITORY_URL ?? "https://github.com/baditaflorin/cinematheca"
    ),
    __PAYPAL_URL__: JSON.stringify(
      process.env.VITE_PAYPAL_URL ?? "https://www.paypal.com/paypalme/florinbadita"
    )
  }
});
