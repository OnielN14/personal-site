import { Outlet, useLoaderData } from "@remix-run/react";
import MainHeader from "~/components/MainHeader";
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return json({
        loggedIn: !!(await authenticator.isAuthenticated(request))
    })
}

export default function MainLayout() {
    const { loggedIn } = useLoaderData<typeof loader>()

    return (
        <div className="min-h-dvh">
            <MainHeader loggedIn={loggedIn} />
            <Outlet />
        </div>
    )
}