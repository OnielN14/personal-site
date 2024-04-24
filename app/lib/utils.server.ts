import { parseHTML } from "linkedom";

export function getTextContentFromHtmlString(html: string) {
    const parsedElement = parseHTML(`<div>${html}</div>`);

    return parsedElement.document.querySelector("div")?.textContent ?? null;
}
