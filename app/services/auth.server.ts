import { createCookieSessionStorage } from "@remix-run/node";
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

const authenticator = new Authenticator<string>(sessionStorage);

checkNull(process.env.APP_URL);
checkNull(process.env.OAUTH_GITHUB_CLIENT_ID);
checkNull(process.env.OAUTH_GITHUB_CLIENT_SECRET);
checkNull(process.env.GITHUB_USER);

const basicAuthPayload = Buffer.from(
    `${process.env.OAUTH_GITHUB_CLIENT_ID}:${process.env.OAUTH_GITHUB_CLIENT_SECRET}`
).toString("base64");

authenticator.use(
    new GitHubStrategy(
        {
            clientID: process.env.OAUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/oauth/callback`,
            allowSignup: false,
        },
        async ({ accessToken, profile }) => {
            if (profile.displayName === process.env.GITHUB_USER)
                return profile.displayName;

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
                    access_token: accessToken,
                }),
            });

            throw new UnauthorizedLoginError();
        }
    )
);

type PolicyCallback<Input, R> = (input: Input) => Promise<R>;

const authenticated = async <T>(
    request: Request,
    callback: PolicyCallback<{ user: string }, T>
) => {
    const displayName = await authenticator.isAuthenticated(request);
    if (!displayName) throw forbidden();

    return await callback({ user: displayName });
};

export { authenticator, authenticated, sessionStorage };
