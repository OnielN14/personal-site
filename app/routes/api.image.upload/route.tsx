import { ActionFunctionArgs, NodeOnDiskFile, json, unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { authenticated } from "~/services/auth.server";
import path from "path"
import { MAX_FILE_SIZE, imageSchemaValidation } from "./utils";

const uploadDir = '/upload'
const publicUpload = '/public' + uploadDir

const uploadHandler = unstable_createFileUploadHandler({
    file: ({ filename }) => filename,
    directory: path.join(process.cwd(), publicUpload),
    maxPartSize: MAX_FILE_SIZE,
})

export const action = async ({ request }: ActionFunctionArgs) => {
    return authenticated(request, async () => {
        const tempFormData = await request.formData()
        const imageBlob = tempFormData.get('image') as Blob

        const result = await imageSchemaValidation.safeParseAsync(imageBlob)

        if (!result.success) {
            return json({
                message: result.error.issues[0].message
            }, 400)
        }

        const formData = await unstable_parseMultipartFormData(request, uploadHandler)

        const file = formData.get('image') as NodeOnDiskFile
        const url = new URL(request.url)

        return json({
            url: `${url.origin}${uploadDir}/${encodeURIComponent(file.name)}`
        })
    })
}