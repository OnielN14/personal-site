import { z } from "zod";
import { imageSchemaValidation } from "~/routes/api.image.upload/utils";

export const createProjectFormDataDto = z.object({
    project_name: z.string().min(4),
    description: z.string().optional(),
    is_published: z.string().optional(),
    link: z.string().url(),
    released_at: z.string(),
    techstack: z.array(z.string()),
});

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
