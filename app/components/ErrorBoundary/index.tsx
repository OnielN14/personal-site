import { isRouteErrorResponse, useNavigate, useRouteError } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import UnderConstruction from "../UnderConstruction"


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
            const isDataString = typeof error.data === 'string'
            const responseData = isDataString
                ? (<p>{error.data}</p>)
                : (<pre className="w-full text-left bg-gray-200 rounded p-2">{JSON.stringify(error.data, null, 2)}</pre>)

            errorElement = (
                <div className="text-center flex items-center justify-center gap-2 flex-col mb-8">
                    <img alt="general error" src="/img/question-mark.png" className="max-w-[300px]" />
                    <h1 className="text-4xl font-bold">{error.status} {error.statusText}</h1>
                    {isNotFound ? null : responseData}
                </div>
            )
        }
    } else if (error instanceof Error) {
        errorElement = (
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Error</h1>
                <p className="mb-4">{error.message}</p>
                <p>The stack trace is:</p>
                <pre className="px-2 py-1 overflow-y-scroll overflow-hidden max-h-[300px] text-wrap bg-gray-300 rounded">{error.stack}</pre>
            </div>
        )
    }

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center max-w-[600px]">
                {errorElement}
                {backButtonElement}
            </div>
        </div>
    )
}