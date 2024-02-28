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
    formMessageBaseClassName,
} from "~/components/ui/form";
import { ClientOnly } from "remix-utils/client-only";
import MdEditorField from "./MdEditorField.client";
import { cn } from "~/lib/utils";
import { ACCEPTED_IMAGE_TYPES } from "../api.image.upload/utils";
import { Label } from "~/components/ui/label";
import React, { useEffect, useState } from "react";
import {
    BaseCreateArticleFormDataDto,
    NOTE_PUBLISH_TYPE,
    clientSchema,
} from "~/services/notes.util";

export const resolver = zodResolver(clientSchema);

interface CreateFormProps {
    action: string;
    data?: BaseCreateArticleFormDataDto & {
        thumbnail_url?: string | null;
    };
}

export default function CreateForm({ action, data }: CreateFormProps) {
    const form = useRemixForm({
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

    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const thumbnailPreviewSrc = blobUrl ?? data?.thumbnail_url;

    useEffect(() => {
        return () => {
            blobUrl && URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

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

                <FormFieldProvider name="thumbnail">
                    <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("thumbnail", {
                                    onChange: (
                                        ev: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        const file = ev.target.files?.item(0);
                                        if (file) {
                                            setBlobUrl(
                                                URL.createObjectURL(file)
                                            );
                                        }
                                    },
                                })}
                                type="file"
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            />
                        </FormControl>
                        <p
                            className={cn(
                                formMessageBaseClassName,
                                "italic text-gray-400 font-light"
                            )}
                        >
                            Minimum dimension recommendation: 650x300
                        </p>
                        <FormMessage />

                        {thumbnailPreviewSrc ? (
                            <div className="mt-1">
                                <Label>Preview</Label>
                                <div className="p-2 bg-gray-400 rounded-md">
                                    <img
                                        src={thumbnailPreviewSrc}
                                        alt="thumbnail preview"
                                        className="object-cover w-full aspect-[calc(650/300)]"
                                    />
                                </div>
                            </div>
                        ) : null}
                    </FormItem>
                </FormFieldProvider>

                <ClientOnly fallback={<div>Loading</div>}>
                    {() => <MdEditorField />}
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
                        value={NOTE_PUBLISH_TYPE.SAVE}
                    >
                        Save Draft
                    </Button>
                    <Button
                        onClick={handleSubmitterClick}
                        type="submit"
                        name="is_published"
                        value={NOTE_PUBLISH_TYPE.PUBLISH}
                    >
                        Publish
                    </Button>
                </div>
            </Form>
        </RemixFormProvider>
    );
}
