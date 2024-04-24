import { Form, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRemixForm, RemixFormProvider } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormControl,
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { ClientOnly } from "remix-utils/client-only";
import MdEditorField from "./MdEditorField.client";
import { ACCEPTED_IMAGE_TYPES } from "../api.image.upload/utils";
import {
    BaseCreateArticleFormDataDto,
    clientSchema,
} from "~/services/notes.util";
import { z } from "zod";
import SimpleImageUploaderField from "./SimpleImageUploaderField";
import { PUBLISH_TYPE } from "~/services/util";

export const resolver = zodResolver(clientSchema);

export type FormFieldValues = Partial<
    Omit<z.infer<typeof clientSchema>, "thumbnail"> & {
        thumbnail: string;
        thumbnail_url: string | null;
    }
>;

interface CreateFormProps {
    action: string;
    data?: BaseCreateArticleFormDataDto & {
        thumbnail_url?: string | null;
    };
}

export default function CreateForm({ action, data }: CreateFormProps) {
    const form = useRemixForm<FormFieldValues>({
        resolver,
        stringifyAllValues: false,
        values: {
            ...data,
            thumbnail: "",
            thumbnail_url: null,
        },
        mode: "onSubmit",
        submitConfig: {
            action,
            encType: "multipart/form-data",
        },
    });

    const navigate = useNavigate();
    const handleCancel = () => navigate(-1);

    const handleSubmitterClick = (
        ev: React.PointerEvent<HTMLButtonElement>
    ) => {
        form.setValue("is_published", ev.currentTarget.value);
    };

    return (
        <RemixFormProvider {...form}>
            <Form
                method="post"
                onSubmit={form.handleSubmit}
                className="flex flex-col gap-y-2"
            >
                <FormFieldProvider name="title">
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("title", {
                                    onChange: () => form.trigger("title"),
                                    onBlur: () => form.trigger("title"),
                                })}
                                placeholder="Something that make the reader excited"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <SimpleImageUploaderField<FormFieldValues>
                    name="thumbnail"
                    previewUrl={data?.thumbnail_url}
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    label="Thumbnail Image"
                />

                <ClientOnly fallback={<div>Loading</div>}>
                    {() => (
                        <MdEditorField<FormFieldValues>
                            name="content"
                            label="Content"
                        />
                    )}
                </ClientOnly>

                <div className="flex gap-x-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitterClick}
                        variant="secondary"
                        type="submit"
                        name="is_published"
                        value={PUBLISH_TYPE.SAVE}
                    >
                        Save Draft
                    </Button>
                    <Button
                        onClick={handleSubmitterClick}
                        type="submit"
                        name="is_published"
                        value={PUBLISH_TYPE.PUBLISH}
                    >
                        Publish
                    </Button>
                </div>
            </Form>
        </RemixFormProvider>
    );
}
