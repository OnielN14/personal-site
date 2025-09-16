import {
    Links,
    LinksFunction,
    LoaderFunctionArgs,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    data,
} from "react-router";
import styles from "./globals.css?url";

import ErrorBoundaryElement from "~/components/ErrorBoundary";
import { authenticator } from "./services/auth.server";
import { SerializeFrom } from "./services/util";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const isAuthenticated = await authenticator.isAuthenticated(request);

    return data({
        isAuthenticated: Boolean(isAuthenticated),
    });
};

export type RootLoaderData = SerializeFrom<typeof loader>;

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/png", href: "/favicon.png" },
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="font-inter">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="font-inter">
                <ErrorBoundaryElement />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
