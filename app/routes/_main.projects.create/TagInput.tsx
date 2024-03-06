import { cn } from "~/lib/utils";

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
    const handleChange = (val: string[]) => {
        onChange?.(val);
    };

    return (
        <div
            className={cn(
                "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            {valueProp?.length > 0 ? (
                <div className="flex gap-x-1 items-center pl-2">
                    {valueProp.map((v, i) => (
                        <div
                            key={i}
                            className="px-2 py-1 bg-primary text-primary-foreground rounded-md"
                        >
                            {v}
                        </div>
                    ))}
                </div>
            ) : null}
            <input
                name={name}
                type="text"
                className={"h-10 px-3 py-2 outline-none w-full rounded-md"}
                onKeyDown={(ev) => {
                    const { currentTarget } = ev;
                    if (ev.key === separator && currentTarget.value) {
                        const value = currentTarget.value;
                        valueProp?.push(value);

                        handleChange([...valueProp]);
                        currentTarget.value = "";
                        ev.preventDefault();
                        return;
                    }

                    if (ev.key === "Backspace" && !currentTarget.value) {
                        valueProp?.pop();

                        handleChange([...valueProp]);
                        ev.preventDefault();
                        return;
                    }
                }}
            />
        </div>
    );
};

export default TagInput;
