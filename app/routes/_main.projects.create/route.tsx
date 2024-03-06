import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import CreateForm from "./CreateForm";
import { authenticated } from "~/services/auth.server";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    BaseCreateProjectFormDataDto,
    createProjectFormDataDto,
} from "~/services/projects.util";
import {
    handleSingleUpload,
    validateImagePayload,
} from "../api.image.upload/route";
import { SafeParseError, SafeParseReturnType, ZodIssue } from "zod";
import { insertProject } from "~/services/projects.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, () => null);
};

const resolver = zodResolver(createProjectFormDataDto);

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const clonedRequest = request.clone();
        const {
            errors,
            data,
            receivedValues: defaultValues,
        } = await getValidatedFormData<BaseCreateProjectFormDataDto>(
            clonedRequest,
            resolver
        );

        const formData = await request.clone().formData();
        const thumbnailData = formData.get("thumbnail");
        const hasFile = !!(thumbnailData && thumbnailData instanceof File);

        let imageValidationResult: SafeParseReturnType<File, File> | null =
            null;

        if (hasFile) {
            imageValidationResult = await validateImagePayload(request, {
                throwOnError: false,
                fieldName: "thumbnail",
            });
        }

        if (
            errors ||
            (imageValidationResult && !imageValidationResult.success)
        ) {
            const thumbnailError: Record<string, ZodIssue> = {};

            if (imageValidationResult) {
                const { issues } = (
                    imageValidationResult as SafeParseError<File>
                ).error;
                thumbnailError.thumbnail = issues[0];
            }

            return json(
                {
                    errors: {
                        ...errors,
                        ...thumbnailError,
                    },
                    defaultValues,
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                }
            );
        }

        let urlPathname: string | null = null;
        if (hasFile) {
            ({ urlPathname } = await handleSingleUpload(request, "thumbnail"));
        }

        insertProject({
            ...data,
            thumbnail_url: urlPathname,
        });

        return null;
    });
};

export default function Component() {
    return (
        <div className="container pb-[2rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Add Project</h1>
            <CreateForm action="/projects/create" />
        </div>
    );
}
