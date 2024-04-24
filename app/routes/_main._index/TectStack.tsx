import { VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const techItemVariants = cva("bg-foreground text-background font-bold", {
    variants: {
        shape: {
            default: "",
            rounded: "rounded-sm",
        },
        size: {
            default: "p-2",
            sm: "px-2 py-1 text-sm",
        },
    },
    defaultVariants: {
        shape: "default",
        size: "default",
    },
});

type TechItemVariants = VariantProps<typeof techItemVariants>;

interface TechItemProps extends TechItemVariants {
    children: React.ReactNode;
}

const TechItem = ({ children, shape, size }: TechItemProps) => {
    return (
        <div
            className={cn(
                techItemVariants({
                    shape,
                    size,
                })
            )}
        >
            {children}
        </div>
    );
};

interface TechstackProps {
    items: string[];
    className?: string;
    itemVariant?: TechItemVariants;
}
export default function Techstack({
    items,
    className,
    itemVariant,
}: TechstackProps) {
    return (
        <div className={cn("flex gap-2 flex-wrap", className)}>
            {items.map((v, i) => (
                <TechItem
                    key={i}
                    shape={itemVariant?.shape}
                    size={itemVariant?.size}
                >
                    {v}
                </TechItem>
            ))}
        </div>
    );
}
