import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useRemixForm, RemixFormProvider } from "remix-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

export const creatArticleFormDataDto = z.object({
    title: z.string().min(4),
    content: z.string().min(1)
})

export type CreatArticleFormDataDto = z.infer<typeof creatArticleFormDataDto>

export const resolver = zodResolver(creatArticleFormDataDto)


export default function CreateForm() {
    const form = useRemixForm({
        resolver,
        mode: "onChange",
        submitConfig: { method: 'post' },
    })

    return (
        <RemixFormProvider {...form}>
            <Form method="post" onSubmit={form.handleSubmit} className="flex flex-col gap-y-2">
                <FormField
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Something that make the reader excited" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Start with a small step" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-x-2">
                    <Button variant="secondary" type="submit" name="type" value="save">Save Draft</Button>
                    <Button type="submit" name="type" value="publish">Publish</Button>
                </div>
            </Form>
        </RemixFormProvider>
    )
}