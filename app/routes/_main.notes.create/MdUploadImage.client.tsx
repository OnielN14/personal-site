import {
    closeImageDialog$,
    editorRootElementRef$,
    imageDialogState$,
    saveImage$,
    useCellValues,
    usePublisher,
} from "@mdxeditor/editor";
import { useForm, FormProvider } from "react-hook-form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogPortal,
} from "~/components/ui/dialog";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ACCEPTED_IMAGE_TYPES } from "../api.image.upload/utils";
import { Button } from "~/components/ui/button";

export interface ImageFormFields {
    title: string;
    altText: string;
    file: FileList;
}

const MdUploadImage = () => {
    const [state, editorRootElementRef] = useCellValues(
        imageDialogState$,
        editorRootElementRef$
    );
    const saveImage = usePublisher(saveImage$);
    const closeImageDialog = usePublisher(closeImageDialog$);

    const methods = useForm<ImageFormFields>({
        values: (state.type === "editing" ? state.initialValues : {}) as
            | ImageFormFields
            | undefined,
    });

    const { handleSubmit, reset } = methods;

    return (
        <Dialog
            open={state.type !== "inactive"}
            onOpenChange={(open) => {
                if (!open) {
                    closeImageDialog();
                    reset({ title: "", altText: "" });
                }
            }}
        >
            <DialogPortal container={editorRootElementRef?.current}>
                <DialogContent
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    <FormProvider {...methods}>
                        <form
                            className="flex flex-col gap-y-2"
                            onSubmit={(e) => {
                                void handleSubmit(saveImage)(e);
                                reset({ title: "", altText: "" });
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <FormItem>
                                <FormLabel>
                                    Upload an image from your device
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...methods.register("file")}
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                        multiple
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem>
                                <FormLabel>Alt Text</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...methods.register("altText")}
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...methods.register("title")}
                                    />
                                </FormControl>
                            </FormItem>

                            <div className="flex gap-x-2">
                                <DialogClose asChild>
                                    <Button type="reset" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </FormProvider>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default MdUploadImage;
