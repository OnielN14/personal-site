import { useId } from "react";
import { cn } from "~/lib/utils";
import { X, GripVerticalIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

interface TagInputProps {
    name?: string;
    className?: string;
    onChange?: (value: string[]) => void;
    value?: string[];
    separator?: string;
}

interface TagItemProps {
    value: string;
    index: number;
    onDelete: () => void;
}

function SortableTagItem({ value, index, onDelete }: TagItemProps) {
    const { ref } = useSortable({ id: value, index: index });

    return (
        <div
            ref={ref}
            className="px-2 py-1 bg-primary text-primary-foreground rounded-md flex items-center gap-1"
        >
            <button>
                <GripVerticalIcon className="size-3" />
            </button>
            <span>{value}</span>
            <button
                type="button"
                className="text-primary-foreground hover:text-red-300"
                onClick={onDelete}
            >
                <X className="size-3" />
            </button>
        </div>
    );
}

const TagInput = ({
    name,
    className,
    onChange,
    value: valueProp = [],
    separator = ",",
}: TagInputProps) => {
    const tags = valueProp ?? [];
    const inputId = useId();

    const handleChange = (val: string[]) => {
        onChange?.(val);
    };

    const handleDelete = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        handleChange(newTags);
    };

    return (
        <div className={cn("flex flex-wrap flex-col w-full ", className)}>
            <label
                htmlFor={inputId}
                aria-label="Tags input"
                className="flex flex-wrap gap-1 items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 p-2"
            >
                <DragDropProvider
                    onDragEnd={(ev) => {
                        handleChange(move(tags, ev));
                    }}
                >
                    {tags.map((tag, index) => (
                        <SortableTagItem
                            key={tag}
                            value={tag}
                            index={index}
                            onDelete={() => handleDelete(index)}
                        />
                    ))}
                </DragDropProvider>

                <input
                    id={inputId}
                    name={name}
                    type="text"
                    className="h-7 py-2 outline-none rounded-md shrink"
                    onKeyDown={(ev) => {
                        const { currentTarget } = ev;
                        if (ev.key === separator && currentTarget.value) {
                            const value = currentTarget.value;
                            const newTags = [...tags, value];
                            handleChange(newTags);
                            currentTarget.value = "";
                            ev.preventDefault();
                            return;
                        }

                        if (ev.key === "Backspace" && !currentTarget.value) {
                            const newTags = tags.slice(0, -1);
                            handleChange(newTags);
                            ev.preventDefault();
                            return;
                        }
                    }}
                />
            </label>
            <div className="text-xs text-muted-foreground/70 mt-1">
                Press {separator} to create a tag
            </div>
        </div>
    );
};

export default TagInput;
