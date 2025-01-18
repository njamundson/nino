interface ProjectDeliverablesProps {
  deliverables: string[];
}

const ProjectDeliverables = ({ deliverables }: ProjectDeliverablesProps) => {
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Deliverables</h3>
      <div className="grid gap-3">
        {deliverables.map((del, index) => (
          <div 
            key={index}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-gray-600">{del}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDeliverables;