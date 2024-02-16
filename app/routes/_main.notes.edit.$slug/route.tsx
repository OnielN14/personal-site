import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import CreateForm, { BaseCreateArticleFormDataDto, creatArticleFormDataDto } from "../_main.notes.create/CreateForm";
import { getValidatedFormData } from "remix-hook-form"
import { authenticated } from "~/services/auth.server";
import { zodResolver } from "@hookform/resolvers/zod"
import { SafeParseReturnType } from "zod";
import { validateImagePayload, handleSingleUpload } from "../api.image.upload/route";
import { getNoteBySlugParam } from "../_main.notes.$slug/service.server";
import { updateArticle } from "~/services/notes.server";
import { useLoaderData } from "@remix-run/react";

const resolver = zodResolver(creatArticleFormDataDto)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => {
        const note = await getNoteBySlugParam(params)

        return json(note)
    })
}

function isThumbnailPayloadString(thumbnailPayload: FormDataEntryValue | null): thumbnailPayload is string {
    return typeof thumbnailPayload === 'string'
}

function isThumbnailPayloadFile(thumbnailPayload: FormDataEntryValue | null): thumbnailPayload is File {
    return thumbnailPayload instanceof File
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const oldNoteData = await getNoteBySlugParam(params)
        let clonedRequest = request.clone()
        const tempFormData = await clonedRequest.formData()

        const thumbnailFilename = oldNoteData.thumbnail_url?.replace("/upload/", "")

        let thumbnailDataPayload = tempFormData.get('thumbnail')
        if (isThumbnailPayloadString(thumbnailDataPayload)) {
            thumbnailDataPayload = JSON.parse(thumbnailDataPayload)
        }

        const isContentSame = oldNoteData.content === JSON.parse(tempFormData.get('content') as unknown as string ?? '')
        const isTitleSame = oldNoteData.title === JSON.parse(tempFormData.get('title') as unknown as string ?? '')

        if (
            isContentSame &&
            isTitleSame &&
            !thumbnailDataPayload
        ) {
            return null
        }

        let shouldUpdateThumbnail = false
        if (isThumbnailPayloadFile(thumbnailDataPayload)) {
            shouldUpdateThumbnail = thumbnailFilename !== thumbnailDataPayload?.name
        }

        clonedRequest = request.clone()
        const { errors: dataError, data, receivedValues: defaultValues } = await getValidatedFormData<BaseCreateArticleFormDataDto>(clonedRequest, resolver)

        let errors: Record<string, unknown> = { ...dataError }

        let imageValidationResult: SafeParseReturnType<File, File> | null = null

        if (shouldUpdateThumbnail) {
            imageValidationResult = await validateImagePayload(request, { throwOnError: false, fieldName: 'thumbnail' })

            if (!imageValidationResult?.success) {
                const { issues } = imageValidationResult.error

                errors = {
                    ...errors,
                    thumbnail: issues[0]
                }
            }
        }

        if (Object.keys(errors).length > 0) {
            return json({
                errors,
                defaultValues
            }, {
                status: 400,
                statusText: 'Bad Request',
            })
        }


        let urlPathname: string | null = null
        if (shouldUpdateThumbnail) {
            ({ urlPathname } = await handleSingleUpload(request, 'thumbnail'));
        }

        await updateArticle({
            ...data,
            thumbnail_url: urlPathname
        }, oldNoteData.slug)
        return redirect(`/notes/${oldNoteData.slug}`)
    })

}

export default function Component() {
    const note = useLoaderData<typeof loader>()

    return (
        <div className="container pb-[2rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Edit Note</h1>
            <CreateForm action={`/notes/edit/${note.slug}`} data={note} />
        </div>
    )
}