import { cssBundleHref } from "@remix-run/css-bundle";
import {
    LinksFunction,
    LoaderFunctionArgs,
    SerializeFrom,
    json,
} from "@remix-run/node";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import styles from "./globals.css?url";

import ErrorBoundaryElement from "~/components/ErrorBoundary";
import { authenticator } from "./services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const isAuthenticated = await authenticator.isAuthenticated(request);

    return json({
        isAuthenticated: Boolean(isAuthenticated),
    });
};

export type RootLoaderData = SerializeFrom<typeof loader>;

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
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
