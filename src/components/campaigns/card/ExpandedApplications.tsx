import { Application } from "@/integrations/supabase/types/application";

interface ExpandedApplicationsProps {
  applications: Application[];
  onViewCreator: (creator: any, application: any) => void;
}

const ExpandedApplications = ({ applications, onViewCreator }: ExpandedApplicationsProps) => {
  return (
    <div className="space-y-4 mt-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
          </div>
          <div className="text-sm text-gray-500">
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandedApplications;