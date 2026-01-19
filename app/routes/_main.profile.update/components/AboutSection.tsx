import {
    FormField,
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { FormType } from "../CreateForm.type";
import { Plus, Trash2 } from "lucide-react";
import { DescriptionItemReorderList } from "./DescriptionItem";
import { Checkbox } from "~/components/ui/checkbox";

interface AboutSectionProps {
    form: FormType;
}

export default function AboutSection({ form }: AboutSectionProps) {
    const {
        fields: employmentFields,
        append: appendEmployment,
        remove: removeEmployment,
    } = useFieldArray({
        control: form.control,
        name: "about.employment",
    });

    const {
        fields: summaryFields,
        append: appendSummary,
        remove: removeSummary,
    } = useFieldArray({
        control: form.control,
        name: "about.summary",
    });

    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">About</h3>

            {/* Summary */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="space-y-4">
                    {summaryFields.map((v, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 relative"
                        >
                            <FormField
                                name={`about.summary.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder={`Summary ${index + 1}`}
                                                rows={2}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => removeSummary(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            appendSummary({
                                value: "",
                            })
                        }
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Summary
                    </Button>
                </div>
            </div>

            {/* Employment */}
            <div>
                <h4 className="font-medium mb-2">Employment History</h4>
                {employmentFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border rounded-lg p-4 mb-4 relative"
                    >
                        <button
                            type="button"
                            onClick={() => removeEmployment(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormFieldProvider
                                name={`about.employment.${index}.companyName`}
                            >
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register(
                                                `about.employment.${index}.companyName`,
                                            )}
                                            placeholder="Company name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormFieldProvider>

                            <FormFieldProvider
                                name={`about.employment.${index}.role`}
                            >
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register(
                                                `about.employment.${index}.role`,
                                            )}
                                            placeholder="Your role/position"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormFieldProvider>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <FormFieldProvider
                                name={`about.employment.${index}.employmentInformation.startDate`}
                            >
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...form.register(
                                                `about.employment.${index}.employmentInformation.startDate`,
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormFieldProvider>

                            <FormFieldProvider
                                name={`about.employment.${index}.employmentInformation.endDate`}
                            >
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...form.register(
                                                `about.employment.${index}.employmentInformation.endDate`,
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormFieldProvider>

                            <FormFieldProvider
                                name={`about.employment.${index}.employmentInformation.isCurrentCompany`}
                            >
                                <FormItem className="flex items-center gap-2 md:pt-8 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            {...form.register(
                                                `about.employment.${index}.employmentInformation.isCurrentCompany`,
                                            )}
                                        />
                                    </FormControl>
                                    <FormLabel>Current Company</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            </FormFieldProvider>
                        </div>

                        {/* Description Items */}
                        <div className="mt-4">
                            <h5 className="font-medium mb-2">Description</h5>
                            <div className="space-y-2">
                                <DescriptionItemReorderList
                                    data={form.watch(
                                        `about.employment.${index}.description`,
                                    )}
                                    employmentIndex={index}
                                    form={form}
                                    onRemove={(itemIndex) => {
                                        const currentDescription =
                                            form.getValues(
                                                `about.employment.${index}.description`,
                                            );
                                        const newDescription =
                                            currentDescription.filter(
                                                (_, i) => i !== itemIndex,
                                            );
                                        form.setValue(
                                            `about.employment.${index}.description`,
                                            newDescription,
                                        );
                                    }}
                                    onOrderChange={(v) => {
                                        form.setValue(
                                            `about.employment.${index}.description`,
                                            v,
                                            {
                                                shouldValidate: true,
                                            },
                                        );
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const currentDescription =
                                            form.getValues(
                                                `about.employment.${index}.description`,
                                            ) || [];
                                        form.setValue(
                                            `about.employment.${index}.description`,
                                            [
                                                ...currentDescription,
                                                { type: "text", value: [""] },
                                            ],
                                        );
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Description Item
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendEmployment({
                            companyName: "",
                            role: "",
                            employmentInformation: {
                                startDate: "",
                                endDate: "",
                                isCurrentCompany: false,
                            },
                            description: [
                                {
                                    type: "",
                                    value: [""],
                                },
                            ],
                        })
                    }
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employment
                </Button>
            </div>
        </div>
    );
}
