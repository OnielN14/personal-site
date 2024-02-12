import { db } from "~/db/sqlite/connection.server";
import { notes } from "~/db/sqlite/schema.server";
import { BaseCreateArticleFormDataDto } from "./CreateForm";
import slugify from "slugify"


export type CreateArticleDto = BaseCreateArticleFormDataDto & {
    thumbnail_url: string
}
export const insertArticle = async (data: CreateArticleDto) => {
    return await db.insert(notes).values({
        content: data.content,
        title: data.title,
        thumbnail_url: '',
        slug: slugify(data.title, {
            trim: true,
            lower: true
        })
    }).returning()
}
