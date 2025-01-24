import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ApplicationItem from "./ApplicationItem";
import { toast } from "sonner";
import { Application } from "@/types/application";

interface ApplicationsListProps {
  applications: Application[];
  onUpdateApplicationStatus: (applicationId: string, status: string) => void;
}

const ApplicationsList = ({ applications = [], onUpdateApplicationStatus }: ApplicationsListProps) => {
  const [showApplications, setShowApplications] = useState(false);

  // Add error handling for applications data
  if (!Array.isArray(applications)) {
    console.error('Invalid applications data:', applications);
    toast.error("Error loading applications");
    return null;
  }

  // Filter out rejected applications
  const activeApplications = applications.filter(app => {
    if (!app || typeof app !== 'object') {
      console.error('Invalid application object:', app);
      return false;
    }
    return app.status !== 'rejected';
  });

  // If there are no active applications, don't render anything
  if (!activeApplications.length) return null;

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setShowApplications(!showApplications)}
      >
        <span className="font-medium">
          Applications ({activeApplications.length})
        </span>
        {showApplications ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {showApplications && (
        <div className="mt-4 space-y-4">
          {activeApplications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onViewProfile={() => {
                // Implement view profile logic if needed
                console.log('View profile clicked:', application.creator);
              }}
              onMessageCreator={() => {
                // Implement message creator logic if needed
                console.log('Message creator clicked:', application.creator?.user_id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
