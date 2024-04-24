import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1_000_000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const imageSchemaValidation = z
    .instanceof(File)
    .refine(
        (v) => ACCEPTED_IMAGE_TYPES.includes(v.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    );

export { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, imageSchemaValidation };
