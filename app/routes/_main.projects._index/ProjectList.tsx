import { useFetcher, useNavigate } from "react-router";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { useIsAuthenticated } from "~/services/auth.util";
import type { Project } from "~/services/projects.server";
import Techstack from "../_main._index/TectStack";
import { cn } from "~/lib/utils";

interface ProjectListProps {
    items: Project[];
}

const ProjectList = ({ items }: ProjectListProps) => {
    const isAuthenticated = useIsAuthenticated();
    const fetcher = useFetcher();

    return (
        <div className="grid md:grid-cols-3 gap-3">
            {items.length > 0 ? (
                items.map((v) => {
                    if (!isAuthenticated && !v.is_published) {
                        return null;
                    }

                    return (
                        <ProjectItem
                            key={v.id}
                            {...v}
                            onClickDelete={() => {
                                fetcher.submit(
                                    {},
                                    {
                                        action: `/projects/${v.id}`,
                                        method: "DELETE",
                                    },
                                );
                            }}
                        />
                    );
                })
            ) : (
                <div className="md:col-span-3 p-4 text-center text-gray-500">
                    No projects to display yet.
                </div>
            )}
        </div>
    );
};

const ProjectItem = ({
    project_name,
    thumbnail_url,
    description,
    link,
    id,
    released_at,
    techstack,
    is_published,
    onClickDelete,
}: Project & {
    onClickDelete?: (id: string) => void;
}) => {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    return (
        <a
            className="rounded-sm border border-gray-200 hover:border-gray-400 transition-colors overflow-hidden"
            href={link ?? "#"}
            onClick={(ev) => {
                if (!link) ev.preventDefault();
            }}
        >
            <div className="bg-foreground h-[150px] relative">
                {thumbnail_url ? (
                    <img
                        className="h-full w-full object-cover"
                        src={thumbnail_url}
                        alt={project_name}
                    />
                ) : null}

                {!is_published ? (
                    <div className="flex items-center justify-center text-center inset-0 text-white/10 absolute">
                        <p className="uppercase font-bold text-5xl -rotate-[20deg]">
                            draft
                        </p>
                    </div>
                ) : null}

                {isAuthenticated ? (
                    <div className="absolute right-0 bottom-0 p-4 flex gap-4">
                        <Button
                            className="flex gap-2 no-underline"
                            variant="secondary"
                            size="sm"
                            onClick={(ev) => {
                                ev.stopPropagation();
                                ev.preventDefault();
                                navigate(`/projects/edit/${id}`);
                            }}
                        >
                            <LuPencil /> Edit
                        </Button>

                        <Button
                            variant="destructive"
                            className="flex gap-2 no-underline"
                            size="sm"
                            onClick={(ev) => {
                                ev.stopPropagation();
                                ev.preventDefault();
                                onClickDelete?.(id);
                            }}
                        >
                            <LuTrash2 /> Delete
                        </Button>
                    </div>
                ) : null}
            </div>
            <div className="py-2 px-4">
                <h5 className="text-lg font-bold">{project_name}</h5>

                {description ? (
                    <p className="text-sm mb-2">{description}</p>
                ) : null}

                {released_at ? (
                    <YearTag className="mb-2" dateStr={released_at} />
                ) : null}

                {techstack ? (
                    <Techstack
                        items={techstack}
                        itemVariant={{
                            shape: "rounded",
                            size: "sm",
                        }}
                    />
                ) : null}
            </div>
        </a>
    );
};

interface YearTagProps {
    dateStr: string;
    className?: string;
}

const YearTag = ({ dateStr, className }: YearTagProps) => {
    const date = new Date(dateStr);

    return (
        <div
            className={cn(
                "text-center px-2 py-1 text-sm bg-background border border-input rounded-sm font-bold inline-block",
                className,
            )}
        >
            {date.getFullYear()}
        </div>
    );
};

export default ProjectList;
