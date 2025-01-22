interface ProjectDescriptionProps {
  description: string | null;
}

const ProjectDescription = ({ description }: ProjectDescriptionProps) => {
  if (!description) return null;
  
  return (
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProjectDescription;