export function notFound(message = "Not Found") {
    return new Response(message, { status: 404, statusText: message });
}

export function badRequest(body: string) {
    return new Response(body, {
        status: 400,
        statusText: "Bad Request",
    });
}