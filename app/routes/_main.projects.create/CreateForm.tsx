import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import {
    FormControl,
    FormField,
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
    BaseCreateProjectFormDataDto,
    clientSchema,
} from "~/services/projects.util";
import SimpleImageUploaderField from "../_main.notes.create/SimpleImageUploaderField";
import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "../api.image.upload/utils";
import { Button } from "~/components/ui/button";
import { PUBLISH_TYPE } from "~/services/util";
import { Textarea } from "~/components/ui/textarea";
import TagInput from "./TagInput";

const resolver = zodResolver(clientSchema);

export type FormFieldValues = Partial<
    Omit<z.infer<typeof clientSchema>, "thumbnail"> & {
        thumbnail: string;
        thumbnail_url: string | null;
    }
>;

interface CreateFormProps {
    action: string;
    data?: BaseCreateProjectFormDataDto & {
        thumbnail_url?: string | null;
    };
}

export default function CreateForm({ action, data }: CreateFormProps) {
    const form = useRemixForm<FormFieldValues>({
        resolver,
        values: {
            ...data,
            thumbnail: "",
            thumbnail_url: null,
        },
        stringifyAllValues: false,
        mode: "onSubmit",
        submitHandlers: {
            onValid: (data) => {
                console.log(data);
            },
            onInvalid: (err) => {
                console.log(err);
            },
        },
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
                className="flex flex-col gap-y-2"
                onSubmit={form.handleSubmit}
            >
                <FormFieldProvider name="project_name">
                    <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("project_name", {
                                    onChange: () =>
                                        form.trigger("project_name"),
                                    onBlur: () => form.trigger("project_name"),
                                })}
                                placeholder="What have you build?"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormFieldProvider name="link">
                    <FormItem>
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                            <Input {...form.register("link")} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <SimpleImageUploaderField<FormFieldValues>
                    name="thumbnail"
                    label="Thumbnail Image"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    previewUrl={data?.thumbnail_url}
                />

                <FormFieldProvider name="description">
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...form.register("description")} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormFieldProvider name="released_at">
                    <FormItem>
                        <FormLabel>Released At</FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                {...form.register("released_at", {
                                    onChange: () => form.trigger("released_at"),
                                    onBlur: () => form.trigger("released_at"),
                                })}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormField
                    name="techstack"
                    render={({ field: { ref: _ref, ...field } }) => (
                        <FormItem>
                            <FormLabel>Techstack</FormLabel>
                            <FormControl>
                                <TagInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
