import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProjectsHeader = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-nino-text">Browse Projects</h1>
        <p className="text-nino-gray mt-2">
          Discover and apply to exciting opportunities from top brands and resorts
        </p>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-nino-gray" />
          <Input
            placeholder="Search projects..."
            className="pl-10 bg-nino-bg border-transparent focus:border-nino-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Filter</Button>
          <Button variant="secondary">Sort</Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;