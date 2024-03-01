import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const notes = sqliteTable("notes", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid()),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content").notNull(),
    thumbnail_url: text("thumbnail_url"),
    is_published: integer("is_published", { mode: "boolean" }),
    created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
    updated_at: text("updated_at").$defaultFn(() => new Date().toISOString()),
    deleted_at: text("deleted_at").default(sql`NULL`),
    published_at: text("deleted_at").default(sql`NULL`),
});

export const project = sqliteTable("projects", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid()),
    project_name: text("project_name").notNull(),
    thumbnail_url: text("thumbnail_url"),
    description: text("description"),
    link: text("link"),
    is_published: integer("is_published", { mode: "boolean" }),
    created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
    updated_at: text("updated_at").$defaultFn(() => new Date().toISOString()),
    deleted_at: text("deleted_at").default(sql`NULL`),
    published_at: text("published_at").default(sql`NULL`),
    released_at: text("released_at").default(sql`NULL`),
    techstack: text("techstack", {
        mode: "json",
    })
        .default(sql`NULL`)
        .$type<string[]>(),
});
