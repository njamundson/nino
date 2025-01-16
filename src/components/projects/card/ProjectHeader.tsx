interface ProjectHeaderProps {
  company_name: string;
  title: string;
}

const ProjectHeader = ({ company_name, title }: ProjectHeaderProps) => {
  return (
    <div>
      <p className="text-sm font-medium text-white/90 mb-1">
        {company_name}
      </p>
      <h3 className="text-2xl font-semibold leading-tight">
        {title}
      </h3>
    </div>
  );
};

export default ProjectHeader;