interface ProjectListProps {
    items: [];
}

const ProjectList = ({ items }: ProjectListProps) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            {items.map((v, i) => (
                <ProjectItem key={i} />
            ))}
        </div>
    );
};

const ProjectItem = () => <div>Test</div>;

export default ProjectList;
