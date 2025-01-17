import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

const EmptyProjects = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-nino-primary/10 p-4">
          <Search className="h-8 w-8 text-nino-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No projects available</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are currently no active projects. Check back soon for new opportunities to collaborate with amazing brands!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyProjects;