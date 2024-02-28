import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/node";
import CreateForm from "./CreateForm";
import { getValidatedFormData } from "remix-hook-form";
import { authenticated } from "~/services/auth.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeParseError } from "zod";
import {
    validateImagePayload,
    handleSingleUpload,
} from "../api.image.upload/route";
import { insertArticle } from "~/services/notes.server";
import {
    BaseCreateArticleFormDataDto,
    creatArticleFormDataDto,
} from "~/services/notes.util";

const resolver = zodResolver(creatArticleFormDataDto);

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => null);
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const clonedRequest = request.clone();
        const {
            errors,
            data,
            receivedValues: defaultValues,
        } = await getValidatedFormData<BaseCreateArticleFormDataDto>(
            clonedRequest,
            resolver
        );

        const imageValidationResult = await validateImagePayload(request, {
            throwOnError: false,
            fieldName: "thumbnail",
        });

        if (errors || !imageValidationResult.success) {
            const { issues } = (imageValidationResult as SafeParseError<File>)
                .error;

            return json(
                {
                    errors: {
                        ...errors,
                        thumbnail: issues[0],
                    },
                    defaultValues,
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                }
            );
        }

        const { urlPathname } = await handleSingleUpload(request, "thumbnail");

        insertArticle({
            ...data,
            thumbnail_url: urlPathname,
        });
        return redirect("/notes");
    });
};

export default function Component() {
    return (
        <div className="container pb-[2rem] md:mx-auto">
            <h1 className="text-2xl font-medium">Create Note</h1>
            <CreateForm action="/notes/create" />
        </div>
    );
}
