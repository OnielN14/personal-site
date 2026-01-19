import { z } from "zod/v4";
import type { useRemixForm } from "remix-hook-form";
import PersonalInfoSchema from "~/services/personal-info.schema";

export type FormFieldValues = z.infer<typeof PersonalInfoSchema>;
export type FormType = ReturnType<typeof useRemixForm<FormFieldValues>>;
