import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
    redirect,
} from "@remix-run/node";
import CreateForm from "../_main.notes.create/CreateForm";
import { getValidatedFormData } from "remix-hook-form";
import { authenticated } from "~/services/auth.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeParseReturnType } from "zod";
import {
    validateImagePayload,
    handleSingleUpload,
} from "../api.image.upload/route";
import { getNoteBySlugParam } from "../_main.notes.$slug/service.server";
import { updateArticle } from "~/services/notes.server";
import { useLoaderData } from "@remix-run/react";
import { notes as notesSchema } from "~/db/sqlite/schema.server";
import {
    BaseCreateArticleFormDataDto,
    creatArticleFormDataDto,
} from "~/services/notes.util";
import {
    PUBLISH_TYPE,
    checkDiff,
    isThumbnailPayloadFile,
} from "~/services/util";

const resolver = zodResolver(creatArticleFormDataDto);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => {
        const note = await getNoteBySlugParam(params);

        return json(note);
    });
};

export const meta: MetaFunction = () => [{ title: "Edit Note" }];

export const action = async ({ request, params }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const oldNoteData = await getNoteBySlugParam(params);
        let clonedRequest = request.clone();
        const tempFormData = await clonedRequest.formData();

        const thumbnailFilename = oldNoteData.thumbnail_url?.replace(
            "/upload/",
            ""
        );

        const tempData = Object.fromEntries(
            tempFormData.entries()
        ) as unknown as Omit<typeof notesSchema.$inferSelect, "is_published">;
        const thumbnailDataPayload = tempFormData.get("thumbnail");
        const isPublishedValue = tempFormData.get("is_published");

        const isDiff = checkDiff(["title", "content"], oldNoteData, tempData);
        let isPublishedDiff = false;
        if (
            (oldNoteData.is_published &&
                isPublishedValue === PUBLISH_TYPE.SAVE) ||
            (!oldNoteData.is_published &&
                isPublishedValue === PUBLISH_TYPE.PUBLISH)
        ) {
            isPublishedDiff = true;
        }

        if (!isDiff && !isPublishedDiff && !thumbnailDataPayload) {
            return null;
        }

        let shouldUpdateThumbnail = false;
        if (isThumbnailPayloadFile(thumbnailDataPayload)) {
            shouldUpdateThumbnail =
                thumbnailFilename !== thumbnailDataPayload?.name;
        }

        clonedRequest = request.clone();
        const {
            errors: dataError,
            data,
            receivedValues: defaultValues,
        } = await getValidatedFormData<BaseCreateArticleFormDataDto>(
            clonedRequest,
            resolver
        );

        let errors: Record<string, unknown> = { ...dataError };

        let imageValidationResult: SafeParseReturnType<File, File> | null =
            null;

        if (shouldUpdateThumbnail) {
            imageValidationResult = await validateImagePayload(request, {
                throwOnError: false,
                fieldName: "thumbnail",
            });

            if (!imageValidationResult?.success) {
                const { issues } = imageValidationResult.error;

                errors = {
                    ...errors,
                    thumbnail: issues[0],
                };
            }
        }

        if (Object.keys(errors).length > 0) {
            return json(
                {
                    errors,
                    defaultValues,
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                }
            );
        }

        let urlPathname: string | undefined = undefined;
        if (shouldUpdateThumbnail) {
            ({ urlPathname } = await handleSingleUpload(request, "thumbnail"));
        }

        await updateArticle(
            {
                ...data,
                thumbnail_url: urlPathname,
            },
            oldNoteData.slug
        );
        return redirect(`/notes/${oldNoteData.slug}`);
    });
};

export default function Component() {
    const note = useLoaderData<typeof loader>();

    return (
        <div className="container pb-[2rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Edit Note</h1>
            <CreateForm
                action={`/notes/edit/${note.slug}`}
                data={{
                    ...note,
                    is_published: note.is_published
                        ? PUBLISH_TYPE.PUBLISH
                        : PUBLISH_TYPE.SAVE,
                }}
            />
        </div>
    );
}
