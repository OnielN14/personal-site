import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    data,
    redirect,
} from "react-router";
import { Form, useLoaderData, useNavigate, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import {
    authenticator,
    checkAuthenticated,
    getSession,
    sessionStorage,
} from "~/services/auth.server";
import { AiFillGithub } from "react-icons/ai";
import { UNAUTHORIZED_LOGIN } from "~/services/auth.util";
import { useEffect, useState } from "react";
import { SetCookie } from "@mjackson/headers";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const isAuthenticated = await checkAuthenticated(request);
    const url = new URL(request.url);
    const redirection = url.searchParams.get("redirect");

    if (isAuthenticated) return redirect(redirection ?? "/");

    const session = await getSession(request);
    const error = session.get("error") as string;
    const headers = new Headers();

    if (redirection) {
        headers.append(
            "Set-Cookie",
            new SetCookie({
                name: "redirect",
                value: redirection,
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 300,
            }).toString(),
        );
    }
    headers.append("Set-Cookie", await sessionStorage.destroySession(session));
    return data(
        {
            error,
        },
        {
            headers: headers,
        },
    );
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticator.authenticate("github", request);
};

export default function Login() {
    const navigation = useNavigation();
    const navigate = useNavigate();
    const [timer, setTimer] = useState(3);
    const { error } = useLoaderData<typeof loader>();

    const shouldDisableLoginButton =
        error && error.includes(UNAUTHORIZED_LOGIN);
    const isProgressing =
        navigation.state === "loading" || navigation.state === "submitting";

    useEffect(() => {
        let timeoutId: number | null = null;
        let intervalId: number | null = null;
        if (shouldDisableLoginButton) {
            timeoutId = window.setTimeout(() => {
                navigate("/");
            }, 3000);

            intervalId = window.setInterval(() => {
                setTimer((current) => {
                    if (current === 0) {
                        intervalId && window.clearInterval(intervalId);
                        return current;
                    }
                    return current - 1;
                });
            }, 1000);
        }

        return () => {
            timeoutId && window.clearTimeout(timeoutId);
            intervalId && window.clearInterval(intervalId);
        };
    }, [shouldDisableLoginButton, navigate]);

    return (
        <div className="h-dvh flex items-center justify-center">
            <div className=" flex flex-col items-center h-[200px]">
                <h1 className="self-start text-4xl font-light mb-2">Login</h1>
                <p className="mb-2 text-gray-500">
                    Only the owner can login to this site
                </p>
                <Form method="post" className="mb-2">
                    <Button
                        disabled={shouldDisableLoginButton || isProgressing}
                        className="flex items-center justify-center gap-2"
                    >
                        <AiFillGithub
                            className="fill-background mb-[2px]"
                            size={20}
                        />
                        <span className="text-background">
                            Login with Github
                        </span>
                    </Button>
                </Form>
                {shouldDisableLoginButton ? (
                    <p className="text-xs text-destructive">{`You're not the owner. You will be redirected in ${timer}s`}</p>
                ) : null}
            </div>
        </div>
    );
}
