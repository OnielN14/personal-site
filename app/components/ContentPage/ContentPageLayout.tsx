import { cn } from "~/lib/utils";

interface ContentPageLayoutProps {
    className?: string;
    children: React.ReactNode;
}

export default function ContentPageLayout({
    children,
    className,
}: ContentPageLayoutProps) {
    return (
        <div
            className={cn("container flex flex-col gap-2 pt-[5rem]", className)}
        >
            {children}
        </div>
    );
}
