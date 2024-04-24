import { defineConfig } from "drizzle-kit";
import path from "path";

const dbRootPath = "./app/db/sqlite";

export default defineConfig({
    schema: `${dbRootPath}/schema.server.ts`,
    out: path.join(dbRootPath, "migrations"),
    driver: "turso",
});
