import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox, XCircle } from "lucide-react";
import ProposalsList from "./ProposalsList";

interface ProposalsTabsProps {
  pendingApplications: any[];
  acceptedApplications: any[];
  rejectedApplications: any[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalsTabs = ({
  pendingApplications,
  acceptedApplications,
  rejectedApplications,
  isLoading,
  onUpdateStatus
}: ProposalsTabsProps) => {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[600px] p-1 rounded-full bg-nino-bg">
        <TabsTrigger 
          value="pending" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Inbox className="w-4 h-4" />
          Pending
        </TabsTrigger>
        <TabsTrigger 
          value="accepted" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Send className="w-4 h-4" />
          Accepted
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <XCircle className="w-4 h-4" />
          Rejected
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        <ProposalsList
          applications={pendingApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
        />
      </TabsContent>
      
      <TabsContent value="accepted" className="mt-6">
        <ProposalsList
          applications={acceptedApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
        />
      </TabsContent>

      <TabsContent value="rejected" className="mt-6">
        <ProposalsList
          applications={rejectedApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsTabs;