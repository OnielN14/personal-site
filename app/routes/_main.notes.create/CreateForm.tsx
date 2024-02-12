import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRemixForm, RemixFormProvider } from "remix-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { FormControl, FormFieldProvider, FormItem, FormLabel, FormMessage, formMessageBaseClassName } from "~/components/ui/form";
import { ClientOnly } from "remix-utils/client-only"
import MdEditorField from "./MdEditorField.client";
import { cn } from "~/lib/utils";
import { ACCEPTED_IMAGE_TYPES, imageSchemaValidation } from "../api.image.upload/utils";

export const creatArticleFormDataDto = z.object({
    title: z.string().min(4),
    content: z.string().min(1),
})

const clientSchema = creatArticleFormDataDto.and(z.object({
    thumbnail: z.custom<FileList>().superRefine((files, ctx) => {
        if (files?.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Required'
            })

            return false
        }

        if (files?.length > 0) {
            const result = imageSchemaValidation.safeParse(files.item(0))
            if (!result.success) {
                ctx.addIssue(result.error.issues[0])

                return false
            }
        }

        return true
    })
}))

export type BaseCreateArticleFormDataDto = z.infer<typeof creatArticleFormDataDto>

export const resolver = zodResolver(clientSchema)

export default function CreateForm() {
    const form = useRemixForm({
        resolver,
        mode: "onSubmit",
        submitConfig: {
            encType: 'multipart/form-data'
        }
    })

    return (
        <RemixFormProvider {...form}>
            <Form method="post" onSubmit={form.handleSubmit} className="flex flex-col gap-y-2">

                <FormFieldProvider name="title">
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...form.register('title', {
                                onChange: () => form.trigger('title'),
                                onBlur: () => form.trigger('title')
                            })} placeholder="Something that make the reader excited" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormFieldProvider name="thumbnail">
                    <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                            <Input {...form.register('thumbnail')} type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} />
                        </FormControl>
                        <p className={cn(formMessageBaseClassName, 'italic text-gray-400 font-light')}>Minimum dimension recommendation: 650x300</p>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <ClientOnly fallback={<div>Loading</div>}>
                    {() => <MdEditorField />}
                </ClientOnly>

                <div className="flex gap-x-2">
                    <Button variant="secondary" type="submit" name="type" value="save">Save Draft</Button>
                    <Button type="submit" name="type" value="publish">Publish</Button>
                </div>
            </Form>
        </RemixFormProvider>
    )
}