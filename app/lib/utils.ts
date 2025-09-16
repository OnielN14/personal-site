import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseHTML } from "linkedom";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getPageUrl(request: Request) {
    const forwardedProto =
        request.headers.get("X-Forwarded-Proto") ??
        request.headers.get("x-forwarded-roto");

    const url = new URL(request.url);
    url.protocol = forwardedProto ?? url.protocol;

    return url;
}

export function getTextContentFromHtmlString(html: string) {
    const parsedElement = parseHTML(`<div>${html}</div>`);

    return parsedElement.document.querySelector("div")?.textContent ?? null;
}

export async function wait(ms = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
