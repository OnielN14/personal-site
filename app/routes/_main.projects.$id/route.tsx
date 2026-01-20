import type { Route } from ".react-router/types/app/routes/_main.projects.$id/+types/route";
import { redirect } from "react-router";
import { serialize } from "superjson";
import { badRequest } from "~/http/bad-request";
import { deleteProjectByIdParam } from "~/services/projects.server";

export const action = async ({ request, params }: Route.ActionArgs) => {
    try {
        if (request.method === "DELETE") {
            await deleteProjectByIdParam(params.id);

            return redirect("/projects");
        }

        throw badRequest();
    } catch (error) {
        console.error(error);
        return Response.json(
            serialize({
                message: (error as Error).message,
                error: error as Error,
            }).json,
            {
                status: 500,
            },
        );
    }
};
