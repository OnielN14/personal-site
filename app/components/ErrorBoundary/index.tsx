import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, LiveReload, Meta, Scripts, isRouteErrorResponse, useNavigate, useRouteError } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import UnderConstruction from "../UnderConstruction"
import { LinksFunction } from "@remix-run/node";
import styles from "~/globals.css"

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: styles },
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function ErrorBoundary() {
    const navigate = useNavigate()

    const backButtonElement = <Button variant="outline" onClick={() => navigate("/")}>Back</Button>
    const error = useRouteError()

    let errorElement = <h1>Unknown Error</h1>
    if (isRouteErrorResponse(error)) {

        if (error.status === 503) {
            errorElement = <UnderConstruction />
        } else {
            const isNotFound = error.status === 404
            errorElement = (
                <div className="text-center flex items-center justify-center gap-2 flex-col mb-8">
                    <img alt="general error" src="/img/question-mark.png" className="max-w-[300px]" />
                    <h1 className="text-4xl font-bold">{error.status} {error.statusText}</h1>
                    {isNotFound ? null : (<p>{error.data}</p>)}
                </div>
            )
        }
    } else if (error instanceof Error) {
        errorElement = (
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Error</h1>
                <p className="mb-4">{error.message}</p>
                <p>The stack trace is:</p>
                <pre className="px-2 py-1 max-w-[600px] overflow-y-scroll overflow-hidden max-h-[300px] text-wrap bg-gray-300 rounded">{error.stack}</pre>
            </div>
        )
    }

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="font-inter">
                <div className="min-h-dvh flex flex-col items-center justify-center">
                    {errorElement}
                    {backButtonElement}
                </div>
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}