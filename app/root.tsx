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
import { checkAuthenticated } from "./services/auth.server";
import { SerializeFrom } from "./services/util";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const isAuthenticated = await checkAuthenticated(request);

    return data({
        isAuthenticated: Boolean(isAuthenticated),
    });
};

export type RootLoaderData = SerializeFrom<typeof loader>;

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    },
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
