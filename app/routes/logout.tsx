import { ActionFunctionArgs } from "@remix-run/node";
import { badRequest, notFound } from "~/http/bad-request";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    if (!await authenticator.isAuthenticated(request)) {
        throw badRequest("Bad Request")
    }

    await authenticator.logout(request, { redirectTo: "/" })
}

export const loader = () => {
    throw notFound()
}

export default function Logout() {
    return null
}