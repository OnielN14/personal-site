import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import CreateForm, { CreatArticleFormDataDto, resolver } from "./CreateForm";
import { getValidatedFormData } from "remix-hook-form"
import { insertArticle } from "./service.server";
import { authenticated } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => null)
}

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const { errors, data, receivedValues: defaultValues } = await getValidatedFormData(request, resolver)

        if (errors) {
            return json({
                errors,
                defaultValues
            }, {
                status: 400,
                statusText: 'Bad Request',
            })
        }

        insertArticle(data as CreatArticleFormDataDto)
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