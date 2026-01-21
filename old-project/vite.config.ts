import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      let app: any = null;

      // Initialize the app asynchronously
      createServer().then((expressApp) => {
        app = expressApp;
        console.log("✅ Express server initialized for Vite middleware");
      }).catch((err) => {
        console.error("❌ Failed to initialize Express server:", err);
      });

      // Add Express app as middleware before Vite's SPA fallback
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api')) {
          // Log API requests for debugging
          console.log(`[API] ${req.method} ${req.url}`);

          // Check if app is initialized
          if (!app) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Server is initializing, please try again' }));
            return;
          }

          // Ensure proper content-type header for API responses
          res.setHeader('Content-Type', 'application/json');

          app(req, res, (err?: any) => {
            if (err) {
              console.error(`[API Error] ${req.method} ${req.url}:`, err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
            } else {
              next();
            }
          });
        } else {
          next();
        }
      });
    },
  };
}
