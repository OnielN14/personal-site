import { project } from "~/db/sqlite/schema.server";
import { db } from "~/db/sqlite/connection.server";
import { BaseCreateProjectFormDataDto } from "./projects.util";
import { eq } from "drizzle-orm";
import { Params } from "@remix-run/react";
import { paramsSchema } from "~/routes/_main.projects.edit.$id/utils";
import { notFound } from "~/http/bad-request";
import { PUBLISH_TYPE } from "./util";

export type Project = typeof project.$inferSelect;

export type CreateProjectDto = BaseCreateProjectFormDataDto & {
    thumbnail_url: string | null;
};

export type UpdateProjectDto = BaseCreateProjectFormDataDto & {
    thumbnail_url: string | null;
};

const getPublisedAt = (isPublished: boolean) => {
    let published_at = null;
    if (isPublished) published_at = new Date().toISOString();
    return published_at;
};

export const insertProject = async (data: CreateProjectDto) => {
    const is_published = data.is_published === PUBLISH_TYPE.PUBLISH;
    const published_at = getPublisedAt(is_published);

    return await db
        .insert(project)
        .values({
            project_name: data.project_name,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            techstack: data.techstack,
            link: data.link,
            is_published,
            published_at,
            released_at: data.released_at,
        })
        .returning();
};

export const updateProject = async (
    data: Partial<UpdateProjectDto>,
    id: string
) => {
    const is_published = data.is_published === PUBLISH_TYPE.PUBLISH;
    const published_at = getPublisedAt(is_published);

    return await db
        .update(project)
        .set({
            project_name: data.project_name,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            techstack: data.techstack,
            link: data.link,
            is_published,
            published_at,
            released_at: data.released_at,
            updated_at: new Date().toISOString(),
        })
        .where(eq(project.id, id));
};

export const getProjects = async (queryParams: URLSearchParams) => {
    const q = queryParams.get("q");

    const projects = db.query.project.findMany({
        where: (fields, op) => {
            if (q) {
                const pattern = `%${q}%`;
                return op.sql`LOWER(${fields.project_name}) LIKE LOWER(${pattern})`;
            }
        },
    });

    return await projects;
};

export const getProjectByIdParam = async (params: Params<string>) => {
    const validationResult = await paramsSchema.safeParseAsync(params);

    if (!validationResult.success) throw notFound();

    const project = await db.query.project.findFirst({
        where: (schema, operator) =>
            operator.eq(schema.id, validationResult.data.id),
    });

    if (!project) throw notFound();

    return project;
};
