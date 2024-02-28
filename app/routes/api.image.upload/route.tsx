import {
    ActionFunctionArgs,
    NodeOnDiskFile,
    json,
    unstable_createFileUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/node";
import { authenticated } from "~/services/auth.server";
import path from "path";
import { MAX_FILE_SIZE, imageSchemaValidation } from "./utils";

const uploadDir = "/upload";
const publicUpload = "/public" + uploadDir;

interface ValidateImagePayloadParams {
    throwOnError?: boolean;
    fieldName?: string;
}

export const validateImagePayload = async (
    request: Request,
    { throwOnError, fieldName }: ValidateImagePayloadParams = {
        throwOnError: true,
    }
) => {
    const tempFormData = await request.clone().formData();
    const imageBlob = tempFormData.get(fieldName ?? "image") as Blob;

    const result = await imageSchemaValidation.safeParseAsync(imageBlob);

    if (throwOnError && !result.success) {
        throw json(
            {
                message: result.error.issues[0].message,
            },
            400
        );
    }

    return result;
};

export const uploadHandler = unstable_createFileUploadHandler({
    file: ({ filename }) => filename,
    directory: path.join(process.cwd(), publicUpload),
    maxPartSize: MAX_FILE_SIZE,
});

export const handleSingleUpload = async (
    request: Request,
    fieldName: string = "image"
) => {
    const formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    );

    const file = formData.get(fieldName) as NodeOnDiskFile;
    const url = new URL(request.url);
    const pathname = `${uploadDir}/${encodeURIComponent(file.name)}`;

    return {
        fullUrl: `${url.origin}${pathname}`,
        urlPathname: pathname,
    };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return authenticated(request, async () => {
        await validateImagePayload(request);
        const { fullUrl: url } = await handleSingleUpload(request);

        return json({ url });
    });
};
