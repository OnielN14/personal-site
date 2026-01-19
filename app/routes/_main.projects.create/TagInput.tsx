import { useId } from "react";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";

interface TagInputProps {
    name?: string;
    className?: string;
    onChange?: (value: string[]) => void;
    value?: string[];
    separator?: string;
}

const TagInput = ({
    name,
    className,
    onChange,
    value: valueProp = [],
    separator = ",",
}: TagInputProps) => {
    const compiledValue = valueProp ?? [];
    const handleChange = (val: string[]) => {
        onChange?.(val);
    };
    const inputId = useId();

    return (
        <div className={cn("flex flex-wrap w-full ", className)}>
            <label
                htmlFor={inputId}
                className="flex flex-wrap gap-1 items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 p-2"
            >
                {compiledValue.map((v, i) => (
                    <div
                        key={v}
                        className="px-2 py-1 bg-primary text-primary-foreground rounded-md flex items-center gap-1"
                    >
                        <span>{v}</span>
                        <button
                            type="button"
                            className="text-primary-foreground hover:text-red-300"
                            onClick={() => {
                                const newValue = [...compiledValue];
                                newValue.splice(i, 1);
                                handleChange(newValue);
                            }}
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                ))}
                <input
                    id={inputId}
                    name={name}
                    type="text"
                    className="h-7 py-2 outline-none rounded-md shrink"
                    onKeyDown={(ev) => {
                        const { currentTarget } = ev;
                        if (ev.key === separator && currentTarget.value) {
                            const value = currentTarget.value;
                            compiledValue?.push(value);

                            handleChange([...compiledValue]);
                            currentTarget.value = "";
                            ev.preventDefault();
                            return;
                        }

                        if (ev.key === "Backspace" && !currentTarget.value) {
                            compiledValue?.pop();

                            handleChange([...compiledValue]);
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
