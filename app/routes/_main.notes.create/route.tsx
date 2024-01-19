import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import CreateForm, { CreatArticleFormDataDto, resolver } from "./CreateForm";
import { getValidatedFormData } from "remix-hook-form"
import { insertArticle } from "./service.server";


export const action = async ({ request }: ActionFunctionArgs) => {
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
}

export default function CreateArticle() {
    return (
        <div className="md:w-[40rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Create Article</h1>
            <CreateForm />
        </div>
    )
}