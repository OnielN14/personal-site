import { Await, MetaFunction, useLoaderData } from "@remix-run/react";
import { defer } from "@remix-run/node";
import ContentPage from "~/components/ContentPage";
import { Project } from "~/services/projects.server";
import { nanoid } from "nanoid";
import slugify from "slugify";
import ProjectList from "./ProjectList";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

const projectSample: Project[] = Array.from({ length: 5 }).map((_, i) => {
    const name = "Project " + (i + 1);
    return {
        created_at: null,
        deleted_at: null,
        updated_at: null,
        is_published: null,
        published_at: null,
        description:
            "Eaque omnis ipsam et quae fugiat doloribus praesentium. Odit non et nemo. Qui libero in a corporis accusantium voluptatem quisquam ut.",
        id: nanoid(),
        project_name: name,
        slug: slugify(name, { trim: true, lower: true }),
        thumbnail_url: null,
    };
});

export const loader = async () => {
    const projects = new Promise<Project[]>((resolve) => {
        setTimeout(() => {
            resolve(projectSample);
        }, 3000);
    });

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
        <ContentPage.Layout>
            <ContentPage.Header
                createLink="/projects/create"
                className="mb-4"
            />
            <Suspense
                fallback={
                    <div className="grid grid-cols-3 gap-2">
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
