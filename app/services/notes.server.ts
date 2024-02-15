import { notes } from "~/db/sqlite/schema.server";

export type Note = typeof notes.$inferSelect
import slugify from "slugify"
import { BaseCreateArticleFormDataDto } from "~/routes/_main.notes.create/CreateForm";
import { db } from "~/db/sqlite/connection.server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";


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