import { notes } from "~/db/sqlite/schema.server";

export type Note = typeof notes.$inferSelect
import slugify from "slugify"
import { BaseCreateArticleFormDataDto } from "~/routes/_main.notes.create/CreateForm";
import { db } from "~/db/sqlite/connection.server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { CursorConfig, generateCursor } from "drizzle-cursor"


export type CreateArticleDto = BaseCreateArticleFormDataDto & {
    thumbnail_url: string
}

export type UpdateArticleDto = BaseCreateArticleFormDataDto & {
    thumbnail_url: string | null
}

export const insertArticle = async (data: CreateArticleDto) => {
    return await db.insert(notes).values({
        content: data.content,
        title: data.title,
        thumbnail_url: data.thumbnail_url,
        slug: slugify(data.title, {
            trim: true,
            lower: true
        }) + nanoid(6)
    }).returning()
}

export const updateArticle = async (data: Partial<UpdateArticleDto>, slug: string) => {
    return await db.update(notes).set({
        ...data,
        updated_at: new Date().toISOString()
    }).where(eq(notes.slug, slug))
}



const cursorOrder = "DESC"
const cursorConfig: CursorConfig = {
    cursors: [
        { key: "updated_at", schema: notes.updated_at, order: cursorOrder },
        { key: "slug", schema: notes.slug, order: cursorOrder },
        { key: "title", schema: notes.title, order: cursorOrder },
    ],
    primaryCursor: { schema: notes.id, key: "id", order: cursorOrder }
}

interface PaginationParams {
    limit?: number | null
    lastItemId?: string | null
}
export const getCursorPaginatedNotes = async ({ limit, lastItemId }: PaginationParams) => {
    const cursor = generateCursor(cursorConfig)

    let lastItemData = null
    if (lastItemId) {
        lastItemData = await db.query.notes.findFirst({
            where: (schema, clauses) => clauses.eq(schema.id, lastItemId)
        })
    }

    return await db.query.notes.findMany({
        where: cursor.where(lastItemData),
        orderBy: cursor.orderBy,
        limit: limit ?? 10
    })
}