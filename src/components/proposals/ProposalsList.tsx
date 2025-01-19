import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProposalCard from "./ProposalCard";

interface ProposalsListProps {
  applications: any[];
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
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
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