import { Card } from "@/components/ui/card";

const ProjectsList = () => {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <p className="text-center text-gray-500">
          No projects available at the moment. Check back later for new opportunities.
        </p>
      </Card>
    </div>
  );
};

export default ProjectsList;