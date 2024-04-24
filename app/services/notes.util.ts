import { z } from "zod";
import { imageSchemaValidation } from "~/routes/api.image.upload/utils";

export const creatArticleFormDataDto = z.object({
    title: z.string().min(4),
    content: z.string().min(1),
    is_published: z.string().optional(),
});

export const clientSchema = creatArticleFormDataDto.and(
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

export type BaseCreateArticleFormDataDto = z.infer<
    typeof creatArticleFormDataDto
>;
