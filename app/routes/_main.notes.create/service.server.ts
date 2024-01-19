import { db } from "~/db/sqlite/connection.server";
import { notes } from "~/db/sqlite/schema.server";
import { CreatArticleFormDataDto } from "./CreateForm";
import slugify from "slugify"

export const insertArticle = async (data: CreatArticleFormDataDto) => {
    return await db.insert(notes).values({
        content: data.content,
        title: data.title,
        slug: slugify(data.title, {
            trim: true,
            lower: true
        })
    }).returning()
}
