import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from "./connection.server";
import path from "path";
import url from "url";

await migrate(db, {
    migrationsFolder: path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "./migrations"
    ),
});

client.close();
