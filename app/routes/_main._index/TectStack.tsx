interface TechItemProps {
    children: React.ReactNode;
}

const TechItem = ({ children }: TechItemProps) => {
    return (
        <div className="bg-foreground text-background p-2 font-bold">
            {children}
        </div>
    );
};

interface TechstackProps {
    items: string[];
}
export default function Techstack({ items }: TechstackProps) {
    return (
        <div className="flex gap-2 flex-wrap">
            {items.map((v, i) => (
                <TechItem key={i}>{v}</TechItem>
            ))}
        </div>
    );
}
