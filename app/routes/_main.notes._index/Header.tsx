import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useIsAuthenticated } from "~/services/auth.util";

export default function Header() {
    const isAuthenticated = useIsAuthenticated()

    return (
        <div className="flex max-w-[20rem] w-full mx-auto gap-4">
            <div className="flex-grow">

            </div>
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