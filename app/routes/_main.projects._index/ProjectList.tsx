import { Link } from "@remix-run/react";
import type { Project } from "~/services/projects.server";

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
    slug,
}: Project) => (
    <Link
        to={`/projects/${slug}`}
        className="rounded-sm border border-gray-200 hover:border-gray-400 transition-colors overflow-hidden"
    >
        <div className="bg-foreground h-[150px]">
            {thumbnail_url ? (
                <img
                    className="h-full w-full object-cover"
                    src={thumbnail_url}
                    alt={project_name}
                />
            ) : null}
        </div>
        <div className="py-2 px-4">
            <h5 className="text-lg font-bold">{project_name}</h5>

            {description ? <p className="line-clamp-3">{description}</p> : null}
        </div>
    </Link>
);

export default ProjectList;
