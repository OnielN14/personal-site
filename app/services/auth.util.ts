
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