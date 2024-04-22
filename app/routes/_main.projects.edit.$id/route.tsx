import { useLoaderData } from "@remix-run/react";
import CreateForm from "../_main.projects.create/CreateForm";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
    redirect,
} from "@remix-run/node";
import { authenticated } from "~/services/auth.server";
import { getProjectByIdParam, updateProject } from "~/services/projects.server";
import {
    PUBLISH_TYPE,
    checkDiff,
    isThumbnailPayloadFile,
} from "~/services/util";
import { project as projectSchema } from "~/db/sqlite/schema.server";
import { getValidatedFormData } from "remix-hook-form";
import {
    BaseEditProjectFormDataDto,
    createProjectFormDataDto,
} from "~/services/projects.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeParseReturnType } from "zod";
import {
    handleSingleUpload,
    validateImagePayload,
} from "../api.image.upload/route";

const resolver = zodResolver(createProjectFormDataDto);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => {
        const project = await getProjectByIdParam(params);

        return json(project);
    });
};

export const meta: MetaFunction = () => [{ title: "Edit Note" }];

export const action = async ({ request, params }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const oldProjectData = await getProjectByIdParam(params);
        let clonedRequest = request.clone();
        const tempFormData = await clonedRequest.formData();

        const thumbnailFilename = oldProjectData.thumbnail_url?.replace(
            "/upload/",
            ""
        );

        const tempData = Object.fromEntries(
            tempFormData.entries()
        ) as unknown as Omit<typeof projectSchema.$inferSelect, "is_published">;
        const thumbnailDataPayload = tempFormData.get("thumbnail");
        const isPublishedValue = tempFormData.get("is_published");
        const isDiff = checkDiff(
            ["project_name", "description", "link"],
            oldProjectData,
            tempData
        );
        let isPublishedDiff = false;
        if (
            (oldProjectData.is_published &&
                isPublishedValue === PUBLISH_TYPE.SAVE) ||
            (!oldProjectData.is_published &&
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
        } = await getValidatedFormData<BaseEditProjectFormDataDto>(
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

        await updateProject(
            {
                ...data,
                thumbnail_url: urlPathname,
            },
            oldProjectData.id
        );

        return redirect("/projects");
    });
};

export default function Component() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container pb-[2rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Add Project</h1>
            <CreateForm
                action={`/projects/edit/${data.id}`}
                data={{
                    ...data,
                    is_published: data.is_published
                        ? PUBLISH_TYPE.PUBLISH
                        : PUBLISH_TYPE.SAVE,
                }}
            />
        </div>
    );
}
