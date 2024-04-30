import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import path from "node:path";

installGlobals();

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        remix({
            ignoredRouteFiles: ["**/*.css"],
        }),
    ],
    ssr: {
        noExternal:
            process.env.NODE_ENV === "production"
                ? [
                      "react-icons",
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
                      "next-themes",
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
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./app"),
        },
    },
});
