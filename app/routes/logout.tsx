import { ActionFunctionArgs, redirect } from "react-router";
import { notFound } from "~/http/bad-request";
import { authenticated, sessionStorage } from "~/services/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    return authenticated(request, async ({ session }) => {
        return redirect("/", {
            headers: {
                "Set-Cookie": await sessionStorage.destroySession(session),
            },
        });
    });
};

export const loader = () => {
    throw notFound();
};

export default function Logout() {
    return null;
}
