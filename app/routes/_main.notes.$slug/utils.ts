import { z } from "zod";

export const paramsSchema = z.object({
    slug: z.string(),
});
