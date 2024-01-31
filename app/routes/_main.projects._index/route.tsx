import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node"
import UnderConstruction from "~/components/UnderConstruction";

export const loader = async () => {
    return json({})
}

export default function ProjectsIndex() {
    useLoaderData<typeof loader>()

    return (
        <div className="flex items-center justify-center h-dvh pt-[5rem]">
            <UnderConstruction />
        </div>
    )
}