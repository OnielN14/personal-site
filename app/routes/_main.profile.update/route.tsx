import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
} from "react-router";
import CreateForm from "./CreateForm";
import { authenticated } from "~/services/auth.server";
import {
    getPersonalInfo,
    updatePersonalInfo,
} from "~/services/personal-info.server";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalInfoSchema from "~/services/personal-info.schema";
import { data as json } from "react-router";

const resolver = zodResolver(PersonalInfoSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => {
        const personalInfo = await getPersonalInfo();

        return personalInfo;
    });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return await authenticated(request, async () => {
        const clonedRequest = request.clone();
        const validationResult = await getValidatedFormData(
            clonedRequest,
            resolver,
        );

        if (
            validationResult.errors &&
            Object.keys(validationResult.errors).length > 0
        ) {
            return json(
                {
                    errors: validationResult.errors,
                    defaultValues: validationResult.receivedValues,
                },
                {
                    status: 400,
                    statusText: "Bad Request",
                },
            );
        }

        const existingPersonalInfo = await getPersonalInfo();
        const id = existingPersonalInfo?.id;
        await updatePersonalInfo({ id, ...validationResult.data! });

        return redirect("/");
    });
};

export default function Component() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="container pb-[2rem] pt-[5rem] md:mx-auto">
            <h1 className="text-2xl font-medium pb-2">Update Profile</h1>
            <CreateForm
                action="/profile/update"
                data={data?.value ?? undefined}
            />
        </div>
    );
}
