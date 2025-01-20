import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ApplicationItem from "./ApplicationItem";

interface ApplicationsListProps {
  applications: any[];
  onViewProfile: (application: any) => void;
  onMessageCreator: (userId: string) => void;
}

const ApplicationsList = ({ applications, onViewProfile, onMessageCreator }: ApplicationsListProps) => {
  const [showApplications, setShowApplications] = useState(false);

  // Filter out rejected and deleted applications
  const activeApplications = applications.filter(app => 
    app.status !== 'rejected' && 
    app.status !== 'deleted'
  );

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
              onViewProfile={() => onViewProfile(application)}
              onMessageCreator={() => onMessageCreator(application.creator?.user_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;