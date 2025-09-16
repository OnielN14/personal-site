import { Params } from "react-router";
import { paramsSchema } from "./utils";
import { notFound } from "~/http/bad-request";
import { db } from "~/db/sqlite/connection.server";
import { notes } from "~/db/sqlite/schema.server";
import { eq } from "drizzle-orm";

export const getNoteBySlugParam = async (params: Params<string>) => {
    const validationResult = await paramsSchema.safeParseAsync(params);

    if (!validationResult.success) {
        throw notFound();
    }

    const note = await db.query.notes.findFirst({
        where: (schema, clauses) =>
            clauses.eq(schema.slug, validationResult.data.slug),
    });

    if (!note) throw notFound();

    return note;
};

export const deleteNoteBySlugParam = async (params: Params<string>) => {
    const validationResult = await paramsSchema.safeParseAsync(params);

    if (!validationResult.success) {
        throw notFound();
    }

    await db.delete(notes).where(eq(notes.slug, validationResult.data.slug));

    return true;
};
