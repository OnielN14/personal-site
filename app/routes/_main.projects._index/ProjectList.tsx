import { Link } from "@remix-run/react";
import { LuPencil } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { useIsAuthenticated } from "~/services/auth.util";
import type { Project } from "~/services/projects.server";
import Techstack from "../_main._index/TectStack";
import { cn } from "~/lib/utils";

interface ProjectListProps {
    items: Project[];
}

const ProjectList = ({ items }: ProjectListProps) => (
    <div className="grid md:grid-cols-3 gap-3">
        {items.map((v, i) => (
            <ProjectItem key={i} {...v} />
        ))}
    </div>
);

const ProjectItem = ({
    project_name,
    thumbnail_url,
    description,
    link,
    id,
    released_at,
    techstack,
}: Project) => {
    const isAuthenticated = useIsAuthenticated();

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

                {isAuthenticated ? (
                    <Button
                        asChild
                        className="absolute right-2 bottom-2 flex gap-2 no-underline"
                        variant="secondary"
                        size="sm"
                    >
                        <Link to={`/projects/edit/${id}`}>
                            <LuPencil /> Edit
                        </Link>
                    </Button>
                ) : null}
            </div>
            <div className="py-2 px-4">
                <h5 className="text-lg font-bold">{project_name}</h5>

                {description ? <p className="text-sm">{description}</p> : null}

                {released_at ? (
                    <YearTag className="my-2" dateStr={released_at} />
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
                className
            )}
        >
            {date.getFullYear()}
        </div>
    );
};

export default ProjectList;
