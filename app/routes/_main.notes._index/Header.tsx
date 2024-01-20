import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function Header() {
    return (
        <div className="flex max-w-[20rem] w-full mx-auto gap-4">
            <div className="flex-grow">

            </div>
            <Button asChild variant="outline">
                <Link to="/notes/create">Create</Link>
            </Button>
        </div>
    )
}