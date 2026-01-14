import { createCookieSessionStorage, Session, SessionData } from "react-router";
import { Authenticator } from "remix-auth";
import { randomBytes } from "node:crypto";
import { GitHubStrategy } from "remix-auth-github";
import { UnauthorizedLoginError, checkNull } from "./auth.util";
import { forbidden } from "~/http/bad-request";

const secretEnv = process.env.SESSION_SECRET;
const secret = secretEnv ?? randomBytes(8).toString("base64");
if (!secretEnv) console.log("SESSION SECRET:", secret);

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [secret],
        secure: process.env.NODE_ENV === "production",
    },
});

const authenticator = new Authenticator<string>();

checkNull(process.env.APP_URL, "process.env.APP_URL is empty");
checkNull(
    process.env.OAUTH_GITHUB_CLIENT_ID,
    "process.env.OAUTH_GITHUB_CLIENT_ID is empty",
);
checkNull(
    process.env.OAUTH_GITHUB_CLIENT_SECRET,
    "process.env.OAUTH_GITHUB_CLIENT_SECRET is empty",
);
checkNull(process.env.GITHUB_USER, "process.env.GITHUB_USER is empty");

const basicAuthPayload = Buffer.from(
    `${process.env.OAUTH_GITHUB_CLIENT_ID}:${process.env.OAUTH_GITHUB_CLIENT_SECRET}`,
).toString("base64");

authenticator.use(
    new GitHubStrategy(
        {
            clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
            redirectURI: `${process.env.APP_URL}/oauth/callback`,
            scopes: ["read:user"],
        },
        async ({ tokens }) => {
            let response = await fetch("https://api.github.com/user", {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${tokens.accessToken()}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            const userProfile = await response.json();

            if (userProfile.login === process.env.GITHUB_USER) {
                return userProfile;
            }

            /**
             *  Revoking non-owner user
             */

            const tokenEndpoint = `https://api.github.com/applications/${process.env.OAUTH_GITHUB_CLIENT_ID}/grant`;

            await fetch(tokenEndpoint, {
                method: "delete",
                headers: {
                    Authorization: `Basic ${basicAuthPayload}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                body: JSON.stringify({
                    access_token: tokens.accessToken(),
                }),
            });

            throw new UnauthorizedLoginError();
        },
    ),
);

type PolicyCallback<Input, R> = (input: Input) => Promise<R> | R;

const authenticated = async <T>(
    request: Request,
    callback: PolicyCallback<
        { user: string; session: Session<SessionData, SessionData> },
        T
    >,
) => {
    const session = await getSession(request);
    const user = session.get("user");
    if (!user) throw forbidden();

    return await callback({ user: user.login, session });
};

const getSession = async (request: Request) => {
    const session = await sessionStorage.getSession(
        request.headers.get("cookie"),
    );

    return session;
};

const checkAuthenticated = async (request: Request) => {
    const session = await getSession(request);

    return session.get("user");
};

export {
    authenticator,
    authenticated,
    getSession,
    checkAuthenticated,
    sessionStorage,
};
