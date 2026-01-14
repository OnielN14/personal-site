import { LoaderFunctionArgs, redirect } from "react-router";
import {
    authenticator,
    getSession,
    sessionStorage,
} from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request);
    let isError = false;

    try {
        const user = await authenticator.authenticate("github", request);
        session.set("user", user);
    } catch (err) {
        console.error(err);
        session.set("error", err?.toString());
        isError = true;
    }

    return redirect(isError ? "/login" : "/", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
};
