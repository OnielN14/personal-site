import { Link, useSearchParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useIsAuthenticated } from "~/services/auth.util";
import { LuSearch } from "react-icons/lu";
import { cn } from "~/lib/utils";

interface HeaderProps {
    className?: string;
    createLink: string;
    action?: string;
}

export default function ContentPageHeader({
    className,
    createLink,
    action,
}: HeaderProps) {
    const isAuthenticated = useIsAuthenticated();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div className={cn("flex w-full mx-auto gap-2", className)}>
            <form
                action={action}
                className="flex-grow flex gap-2"
                onSubmit={(ev) => {
                    ev.preventDefault();
                    const formData = new FormData(ev.currentTarget);
                    const q = formData.get("q");
                    if (q instanceof File) return;

                    setSearchParams((prev) => {
                        if (!q && prev.has("q")) prev.delete("q");
                        else prev.set("q", q ?? "");

                        return prev;
                    });
                }}
            >
                <Input
                    name="q"
                    placeholder="Search..."
                    defaultValue={searchParams.get("q") ?? ""}
                />
                <Button type="submit">
                    <LuSearch className="stroke-background" />
                </Button>
            </form>
            {isAuthenticated ? (
                <Button asChild variant="outline">
                    <Link to={createLink}>Create</Link>
                </Button>
            ) : null}
        </div>
    );
}
