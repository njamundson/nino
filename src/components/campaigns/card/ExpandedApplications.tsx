import { Button } from "@/components/ui/button";
import { Application } from "@/integrations/supabase/types/opportunity";

interface ExpandedApplicationsProps {
  applications: Application[];
  onViewCreator: (creator: any, application: any) => void;
}

const ExpandedApplications = ({ applications, onViewCreator }: ExpandedApplicationsProps) => {
  return (
    <div className="mt-4 space-y-3">
      {applications.map((application) => (
        <div
          key={application.id}
          className="p-3 bg-gray-50/80 rounded-xl cursor-pointer hover:bg-gray-100/80 transition-colors"
          onClick={() => onViewCreator(application.creator, application)}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">
                {application.creator?.first_name} {application.creator?.last_name}
              </p>
              {application.creator?.location && (
                <p className="text-sm text-gray-500 truncate">
                  {application.creator.location}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-nino-primary hover:text-nino-primary/90 whitespace-nowrap"
            >
              View Profile
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandedApplications;