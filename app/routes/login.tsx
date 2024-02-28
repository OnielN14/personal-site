import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/node";
import {
    Form,
    useLoaderData,
    useNavigate,
    useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { authenticator, sessionStorage } from "~/services/auth.server";
import { AiFillGithub } from "react-icons/ai";
import { UNAUTHORIZED_LOGIN } from "~/services/auth.util";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const isAuthenticated = await authenticator.isAuthenticated(request);

    if (isAuthenticated) return redirect("/");

    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );
    const error = session.get(authenticator.sessionErrorKey)?.message as string;

    return json(
        {
            error,
        },
        {
            headers: {
                "Set-Cookie": await sessionStorage.destroySession(session),
            },
        }
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

    const shouldDisableLoginButton = error === UNAUTHORIZED_LOGIN;
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
