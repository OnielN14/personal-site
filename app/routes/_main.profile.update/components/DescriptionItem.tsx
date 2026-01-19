import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { FormType } from "../CreateForm.type";
import { useState, useMemo } from "react";
import { cn } from "~/lib/utils";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { z } from "zod/v4";
import { DescriptionItemSchema } from "~/services/personal-info.schema";
import { nanoid } from "nanoid";
import { MdDragIndicator } from "react-icons/md";

export interface DescriptionItemProps {
    form: FormType;
    employmentIndex: number;
    itemIndex: number;
    onRemove: () => void;
    className?: string;
}

export function DescriptionItem({
    form,
    employmentIndex,
    itemIndex,
    onRemove,
    className,
}: DescriptionItemProps) {
    const [listItems, setListItems] = useState<string[]>(
        form.watch(
            `about.employment.${employmentIndex}.description.${itemIndex}.value`,
        ) || [""],
    );
    const itemType =
        form.watch(
            `about.employment.${employmentIndex}.description.${itemIndex}.type`,
        ) || "text";

    const handleAddListItem = () => {
        setListItems([...listItems, ""]);
        const currentValue =
            form.getValues(
                `about.employment.${employmentIndex}.description.${itemIndex}.value`,
            ) || [];
        form.setValue(
            `about.employment.${employmentIndex}.description.${itemIndex}.value`,
            [...currentValue, ""],
        );
    };

    const handleRemoveListItem = (listItemIndex: number) => {
        const newListItems = listItems.filter((_, i) => i !== listItemIndex);
        setListItems(newListItems);
        form.setValue(
            `about.employment.${employmentIndex}.description.${itemIndex}.value`,
            newListItems,
        );
    };

    const handleListItemChange = (listItemIndex: number, value: string) => {
        const newListItems = [...listItems];
        newListItems[listItemIndex] = value;
        setListItems(newListItems);
        form.setValue(
            `about.employment.${employmentIndex}.description.${itemIndex}.value`,
            newListItems,
        );
    };

    return (
        <div
            className={cn(
                "bg-background mb-4 p-4 border rounded-lg relative",
                className,
            )}
        >
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 gap-4 mb-4">
                {/* Type Select */}
                <FormField
                    name={`about.employment.${employmentIndex}.description.${itemIndex}.type`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="list">List</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Value Input - Different UI based on type */}
                <div className="space-y-2">
                    <FormLabel>Value</FormLabel>
                    {itemType === "text" ? (
                        <FormField
                            name={`about.employment.${employmentIndex}.description.${itemIndex}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter text"
                                            rows={2}
                                            value={field.value?.[0] || ""}
                                            onChange={(e) => {
                                                field.onChange([
                                                    e.target.value,
                                                ]);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <div className="space-y-2">
                            {listItems.map((item, listItemIndex) => (
                                <div
                                    key={listItemIndex}
                                    className="flex gap-2 items-start"
                                >
                                    <Textarea
                                        placeholder={`List item ${listItemIndex + 1}`}
                                        rows={2}
                                        value={item}
                                        onChange={(e) =>
                                            handleListItemChange(
                                                listItemIndex,
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleRemoveListItem(listItemIndex)
                                        }
                                        className="mt-1"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddListItem}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add List Item
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface DescriptionItemListProps<
    TData = Array<
        z.infer<typeof DescriptionItemSchema> & {
            _id?: string;
        }
    >,
> extends Pick<DescriptionItemProps, "form" | "employmentIndex"> {
    data: TData;
    onOrderChange: (data: TData) => void;
    onRemove: (itemIndex: number) => void;
    className?: string;
}

export function DescriptionItemReorderList({
    form,
    onRemove,
    data: dataProp,
    onOrderChange,
    employmentIndex,
}: DescriptionItemListProps) {
    const data = useMemo(
        () =>
            dataProp.map((v) => {
                if ("_id" in v) return v;

                return {
                    _id: nanoid(),
                    ...v,
                };
            }),
        [dataProp],
    );

    return (
        <Reorder.Group
            className="flex flex-col gap-3"
            axis="y"
            values={data}
            onReorder={onOrderChange}
        >
            {data.map((item, itemIndex) => (
                <DescriptionItemReorderItem
                    key={item._id}
                    value={item}
                    form={form}
                    employmentIndex={employmentIndex}
                    itemIndex={itemIndex}
                    onRemove={() => onRemove(itemIndex)}
                />
            ))}
        </Reorder.Group>
    );
}

export function DescriptionItemReorderItem({
    value,
    ...props
}: DescriptionItemProps & {
    value: z.infer<typeof DescriptionItemSchema> & {
        _id?: string;
    };
}) {
    const y = useMotionValue(0);
    const dragControl = useDragControls();

    return (
        <Reorder.Item
            style={{ y }}
            dragListener={false}
            dragControls={dragControl}
            value={value}
            className="block bg-background relative"
            layout="position"
        >
            <div className="flex gap-2 border rounded-md p-4 pl-2">
                <button
                    type="button"
                    className="flex items-start justify-center p-2 pt-1"
                    onPointerDown={(ev) => dragControl.start(ev)}
                >
                    <MdDragIndicator />
                </button>
                <DescriptionItem
                    className="grow border-0 rounded-none p-0 mb-0"
                    {...props}
                />
            </div>
        </Reorder.Item>
    );
}
