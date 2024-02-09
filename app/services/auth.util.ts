import { useMatches } from "@remix-run/react"
import { useMemo } from "react"
import type { RootLoaderData } from "~/root"

export const UNAUTHORIZED_LOGIN = 'Unauthorized Login'
export class UnauthorizedLoginError extends Error {
    constructor() {
        super(UNAUTHORIZED_LOGIN)
    }
}

export function checkNull(value: unknown, message?: string | (() => string)): asserts value {
    if (value) return

    const resolvedMessage = typeof message === 'function' ? message() : message

    throw new Error(resolvedMessage ?? "Invalid")
}

export function useMatchesData<T>(id: string) {
    const matchingRoutes = useMatches()
    const route = useMemo(() => matchingRoutes.find((route) => route.id === id), [matchingRoutes, id])

    return route?.data as T | undefined
}

export function useIsAuthenticated() {
    const data = useMatchesData<RootLoaderData>('root')

    if (data?.isAuthenticated) return true

    return false
}