import { z } from "zod";
import { imageSchemaValidation } from "~/routes/api.image.upload/utils";

export const createProjectFormDataDto = z.object({
    project_name: z.string().min(4),
    description: z.string().optional().nullable(),
    is_published: z.string().optional().nullable(),
    link: z.string().url().nullable(),
    released_at: z.string().nullable(),
    techstack: z.array(z.string()).optional().nullable(),
});

export const editProjectFormDataDto = createProjectFormDataDto.partial();

export const clientSchema = createProjectFormDataDto.and(
    z.object({
        thumbnail: z.custom<FileList>().superRefine((files, ctx) => {
            if (files?.length > 0) {
                const result = imageSchemaValidation.safeParse(files.item(0));
                if (!result.success) {
                    ctx.addIssue(result.error.issues[0]);

                    return false;
                }
            }

            return true;
        }),
    })
);

export type BaseCreateProjectFormDataDto = z.infer<
    typeof createProjectFormDataDto
>;

export type BaseEditProjectFormDataDto = z.infer<typeof editProjectFormDataDto>;
