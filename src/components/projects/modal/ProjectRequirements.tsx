interface ProjectRequirementsProps {
  requirements: string[];
}

const ProjectRequirements = ({ requirements }: ProjectRequirementsProps) => {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
      <div className="grid gap-3">
        {requirements.map((req, index) => (
          <div 
            key={index}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-gray-600">{req}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectRequirements;