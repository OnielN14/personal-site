import {
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { FormType } from "../CreateForm.type";
import { socialIconMap } from "~/routes/_main._index/Intro";
import { Plus, Trash2 } from "lucide-react";

interface SocialLinksSectionProps {
    form: FormType;
}

export default function SocialLinksSection({ form }: SocialLinksSectionProps) {
    const {
        fields: socialFields,
        append: appendSocial,
        remove: removeSocial,
    } = useFieldArray({
        control: form.control,
        name: "socials",
    });

    // Create combobox options from socialIconMap keys
    const socialIconOptions = Object.keys(socialIconMap).map((key) => ({
        value: key,
        label: (
            <div className="flex items-center gap-2">
                {socialIconMap[key]}
                <span className="capitalize">{key}</span>
            </div>
        ),
    }));

    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            {socialFields.map((field, index) => (
                <div
                    key={field.id}
                    className="border rounded-lg p-4 mb-4 relative"
                >
                    <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormFieldProvider name={`socials.${index}.label`}>
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input
                                        {...form.register(
                                            `socials.${index}.label`,
                                        )}
                                        placeholder="e.g., GitHub, Twitter"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormFieldProvider>

                        <FormFieldProvider name={`socials.${index}.link`}>
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...form.register(
                                            `socials.${index}.link`,
                                        )}
                                        placeholder="https://example.com"
                                        type="url"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormFieldProvider>

                        <FormFieldProvider name={`socials.${index}.icon`}>
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => {
                                            form.setValue(
                                                `socials.${index}.icon`,
                                                value,
                                            );
                                        }}
                                        defaultValue={
                                            form.watch(
                                                `socials.${index}.icon`,
                                            ) || ""
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(socialIconMap).map(
                                                ([key, icon]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {icon}
                                                            <span className="capitalize">
                                                                {key}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormFieldProvider>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => appendSocial({ link: "", label: "", icon: "" })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
            </Button>
        </div>
    );
}
