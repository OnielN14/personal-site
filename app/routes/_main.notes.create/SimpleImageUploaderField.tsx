import { useRemixFormContext } from "remix-hook-form";
import {
    FormControl,
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormMessage,
    formMessageBaseClassName,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { FieldPath, FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";

interface SimpleImageUploaderFieldProps<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    name: TFieldName;
    label?: string;
    accept?: string;
    previewUrl?: string | null;
}

export default function SimpleImageUploaderField<
    TFieldValues extends FieldValues
>({
    label,
    name,
    accept,
    previewUrl,
}: SimpleImageUploaderFieldProps<TFieldValues>) {
    const form = useRemixFormContext<TFieldValues>();
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const thumbnailPreviewSrc = blobUrl ?? previewUrl;

    useEffect(() => {
        return () => {
            blobUrl && URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    return (
        <FormFieldProvider name={name}>
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        {...form.register(name, {
                            onChange: (
                                ev: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                const file = ev.target.files?.item(0);
                                if (file) {
                                    setBlobUrl(URL.createObjectURL(file));
                                }
                            },
                        })}
                        type="file"
                        accept={accept}
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
    );
}
