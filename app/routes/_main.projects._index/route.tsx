import { Await, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, defer } from "@remix-run/node";
import ContentPage from "~/components/ContentPage";
import { getProjects } from "~/services/projects.server";
import ProjectList from "./ProjectList";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const urlSearchParams = new URL(request.url).searchParams;
    const projects = getProjects(urlSearchParams);

    return defer({
        projects,
    });
};

export const meta: MetaFunction = () => {
    return [{ title: "Projects" }];
};

export default function ProjectsIndex() {
    const { projects } = useLoaderData<typeof loader>();

    return (
        <ContentPage.Layout className="pb-8">
            <ContentPage.Header
                createLink="/projects/create"
                className="mb-4"
            />
            <Suspense
                fallback={
                    <div className="grid md:grid-cols-3 gap-3">
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                    </div>
                }
            >
                <Await resolve={projects}>
                    {(value) => <ProjectList items={value} />}
                </Await>
            </Suspense>
        </ContentPage.Layout>
    );
}
