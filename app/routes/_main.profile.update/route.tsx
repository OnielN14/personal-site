import { LoaderFunctionArgs, useLoaderData } from "react-router";
import CreateForm from "./CreateForm";
import { authenticated } from "~/services/auth.server";
import { getPersonalInfo } from "~/services/personal-info.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await authenticated(request, async () => {
        const personalInfo = await getPersonalInfo();

        return personalInfo;
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
