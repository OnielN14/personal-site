import { project } from "~/db/sqlite/schema.server";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { db } from "~/db/sqlite/connection.server";
import { BaseCreateProjectFormDataDto } from "./projects.util";
import { eq } from "drizzle-orm";

export type Project = typeof project.$inferSelect;

export type CreateProjectDto = BaseCreateProjectFormDataDto & {
    thumbnail_url: string | null;
};

export type UpdateProjectDto = BaseCreateProjectFormDataDto & {
    thumbnail_url: string | null;
};

export const insertProject = async (data: CreateProjectDto) => {
    return await db
        .insert(project)
        .values({
            project_name: data.project_name,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            slug:
                slugify(data.project_name, {
                    trim: true,
                    lower: true,
                }) + nanoid(6),
        })
        .returning();
};

export const updateProject = async (
    data: Partial<UpdateProjectDto>,
    slug: string
) => {
    return await db
        .update(project)
        .set({
            project_name: data.project_name,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            updated_at: new Date().toISOString(),
        })
        .where(eq(project.slug, slug));
};
