export const PUBLISH_TYPE = {
    PUBLISH: "publish",
    SAVE: "save",
} as const;

export function isString(value: unknown): value is string {
    return typeof value === "string";
}

export function checkDiff<T extends object>(keys: Array<keyof T>, a: T, b: T) {
    let diff = false;
    for (const key of keys) {
        let aValue: unknown = a[key];
        let bValue: unknown = b[key];

        if (isString(aValue) && isString(bValue)) {
            aValue = aValue.trim().replace(/\r\n/g, "\n");
            bValue = bValue.trim().replace(/\r\n/g, "\n");
        }

        if (aValue !== bValue) {
            diff = true;
            break;
        }
    }

    return diff;
}

export function isThumbnailPayloadFile(
    thumbnailPayload: FormDataEntryValue | null
): thumbnailPayload is File {
    return thumbnailPayload instanceof File;
}
