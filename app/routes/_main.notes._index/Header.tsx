import { Link, Form, useSearchParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useIsAuthenticated } from "~/services/auth.util";
import { LuSearch } from "react-icons/lu"
import { cn } from "~/lib/utils";

interface HeaderProps {
    className?: string
}

export default function Header({ className }: HeaderProps) {
    const isAuthenticated = useIsAuthenticated()
    const [searchParams] = useSearchParams()

    return (
        <div className={cn("flex w-full mx-auto gap-2", className)}>
            <Form className="flex-grow flex gap-2">
                <Input name="q" placeholder="Search..." defaultValue={searchParams.get("q") ?? ""} />
                <Button type="submit">
                    <LuSearch className="stroke-background" />
                </Button>
            </Form>
            {
                isAuthenticated ?
                    (
                        <Button asChild variant="outline">
                            <Link to="/notes/create">Create</Link>
                        </Button>
                    ) : null
            }
        </div>
    )
}