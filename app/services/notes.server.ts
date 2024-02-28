import { notes } from "~/db/sqlite/schema.server";

export type Note = typeof notes.$inferSelect;
import slugify from "slugify";
import { db } from "~/db/sqlite/connection.server";
import { and, eq, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { CursorConfig, generateCursor } from "drizzle-cursor";
import { BaseCreateArticleFormDataDto, NOTE_PUBLISH_TYPE } from "./notes.util";

export type CreateArticleDto = BaseCreateArticleFormDataDto & {
    thumbnail_url: string;
};

export type UpdateArticleDto = BaseCreateArticleFormDataDto & {
    thumbnail_url: string | null;
};

export const insertArticle = async (data: CreateArticleDto) => {
    return await db
        .insert(notes)
        .values({
            content: data.content,
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            is_published: data.is_published === NOTE_PUBLISH_TYPE.PUBLISH,
            slug:
                slugify(data.title, {
                    trim: true,
                    lower: true,
                }) + nanoid(6),
        })
        .returning();
};

export const updateArticle = async (
    { content, is_published, thumbnail_url, title }: Partial<UpdateArticleDto>,
    slug: string
) => {
    return await db
        .update(notes)
        .set({
            content,
            is_published: is_published === NOTE_PUBLISH_TYPE.PUBLISH,
            thumbnail_url,
            title,
            updated_at: new Date().toISOString(),
        })
        .where(eq(notes.slug, slug));
};

const cursorOrder = "DESC";
const cursorConfig: CursorConfig = {
    cursors: [
        { key: "updated_at", schema: notes.updated_at, order: cursorOrder },
        { key: "slug", schema: notes.slug, order: cursorOrder },
        { key: "title", schema: notes.title, order: cursorOrder },
    ],
    primaryCursor: { schema: notes.id, key: "id", order: cursorOrder },
};

interface PaginationParams {
    limit?: number | null;
    lastItemId?: string | null;
    q?: string | null;
    withDraft?: boolean;
}

export const getCursorPaginatedNotes = async ({
    limit,
    lastItemId,
    q,
    withDraft,
}: PaginationParams) => {
    const cursor = generateCursor(cursorConfig);

    let lastItemData = null;
    if (lastItemId) {
        lastItemData = await db.query.notes.findFirst({
            where: (schema, clauses) => clauses.eq(schema.id, lastItemId),
        });
    }

    let whereClause = cursor.where(lastItemData);
    if (q) whereClause = and(whereClause, like(notes.title, `%${q}%`));
    if (!withDraft)
        whereClause = and(whereClause, eq(notes.is_published, true));

    return await db.query.notes.findMany({
        where: whereClause,
        orderBy: cursor.orderBy,
        limit: limit ?? 10,
    });
};
