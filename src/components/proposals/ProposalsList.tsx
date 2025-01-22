import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProposalCard from "./ProposalCard";
import { FileSpreadsheet, Send } from "lucide-react";

interface Application {
  id: string;
  status: string;
  opportunity: {
    id: string;
    title: string;
    location: string | null;
    image_url: string | null;
    brand: {
      company_name: string | null;
    } | null;
  };
}

interface ProposalsListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalsList = ({ applications, isLoading, onUpdateStatus, type }: ProposalsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {type === 'proposal' ? (
              <FileSpreadsheet className="h-12 w-12 text-gray-400" />
            ) : (
              <Send className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {type === 'proposal' 
              ? 'No pending proposals'
              : 'No applications submitted yet'
            }
          </h3>
          <p className="text-gray-500">
            {type === 'proposal'
              ? 'When brands invite you to their campaigns, they will appear here.'
              : 'When you apply to campaigns, your applications will appear here.'
            }
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <ProposalCard
          key={application.id}
          application={application}
          onUpdateStatus={onUpdateStatus}
          type={type}
        />
      ))}
    </div>
  );
};

export default ProposalsList;