import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import arraybuffer from "vite-plugin-arraybuffer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [reactRouter(), arraybuffer(), tsconfigPaths()],
    ssr: {
        noExternal:
            process.env.NODE_ENV === "production"
                ? [
                      "react-icons",
                      "lucide-react",
                      /^@radix-ui.*/,
                      /^@headlessui.*/,
                      "linkedom",
                      "framer-motion",
                      "tailwind-merge",
                      "@hookform/resolvers",
                      "class-variance-authority",
                      "clsx",
                      "cmdk",
                      "date-fns",
                      "embla-carousel-react",
                      "react-day-picker",
                      "react-hook-form",
                      "react-resizable-panels",
                      "remix-auth",
                      "remix-auth-github",
                      "remix-hook-form",
                      "remix-utils",
                      "slugify",
                      "sonner",
                      "vaul",
                      "zod",
                      "isbot",
                  ]
                : undefined,
    },
});
