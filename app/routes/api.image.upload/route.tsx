import { ActionFunctionArgs, data } from "react-router";
import { authenticated } from "~/services/auth.server";
import { MAX_FILE_SIZE, imageSchemaValidation } from "./utils";
import fsp from "node:fs/promises";
import path from "path";

export const uploadDir = "/upload";
export const publicUpload = "/public" + uploadDir;

interface ValidateImagePayloadParams {
    throwOnError?: boolean;
    fieldName?: string;
}

export const validateImagePayload = async (
    request: Request,
    { throwOnError, fieldName }: ValidateImagePayloadParams = {
        throwOnError: true,
    },
) => {
    const tempFormData = await request.clone().formData();
    const imageBlob = tempFormData.get(fieldName ?? "image") as Blob;

    const result = await imageSchemaValidation.safeParseAsync(imageBlob);

    if (throwOnError && !result.success) {
        throw Response.json(
            {
                message: result.error.issues[0].message,
            },
            { status: 400 },
        );
    }

    return result;
};

export const handleSingleUpload = async (
    request: Request,
    fieldName: string = "image",
) => {
    const formData = await request.formData();
    const file = formData.get(fieldName) as File;

    if (file.size > MAX_FILE_SIZE) {
        throw Response.json(
            {
                message: `The file size exceeds maximum allowed size ${MAX_FILE_SIZE} bytes`,
            },
            {
                status: 400,
            },
        );
    }

    const filepath = path.join(process.cwd(), publicUpload, file.name);
    await fsp.writeFile(filepath, new Uint8Array(await file.arrayBuffer()));

    const url = new URL(request.url);
    const pathname = `${uploadDir}/${file.name}`;

    return {
        fullUrl: `${url.origin}${pathname}`,
        urlPathname: pathname,
    };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return authenticated(request, async () => {
        await validateImagePayload(request);
        const { fullUrl: url } = await handleSingleUpload(request);

        return data({ url });
    });
};
