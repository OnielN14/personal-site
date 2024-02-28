import { Params } from "@remix-run/react";
import { paramsSchema } from "./utils";
import { notFound } from "~/http/bad-request";
import { db } from "~/db/sqlite/connection.server";

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
