import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import CreateForm, { BaseCreateArticleFormDataDto, creatArticleFormDataDto } from "./CreateForm";
import { getValidatedFormData } from "remix-hook-form"
import { insertArticle } from "./service.server";
import { authenticated } from "~/services/auth.server";
import { zodResolver } from "@hookform/resolvers/zod"
import { SafeParseError } from "zod";
import { validateImagePayload, handleSingleUpload } from "../api.image.upload/route";

const resolver = zodResolver(creatArticleFormDataDto)

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => null)
}

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const clonedRequest = request.clone()
        const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<BaseCreateArticleFormDataDto>(clonedRequest, resolver)

        const imageValidationResult = await validateImagePayload(request, { throwOnError: false, fieldName: 'thumbnail' })

        if (errors || !imageValidationResult.success) {
            const { issues } = (imageValidationResult as SafeParseError<File>).error

            return json({
                errors: {
                    ...errors,
                    thumbnail: issues[0]
                },
                defaultValues
            }, {
                status: 400,
                statusText: 'Bad Request',
            })
        }

        const { urlPathname } = await handleSingleUpload(request, 'thumbnail')

        insertArticle({
            ...data,
            thumbnail_url: urlPathname
        })
        return redirect("/notes")
    })

}

export default function CreateArticle() {
    return (
        <div className="container md:mx-auto">
            <h1 className="text-2xl font-medium">Create Article</h1>
            <CreateForm />
        </div>
    )
}