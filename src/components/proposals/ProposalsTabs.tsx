import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox, XCircle } from "lucide-react";
import ProposalsList from "./ProposalsList";

interface ProposalsTabsProps {
  pendingApplications: any[];
  myInvites: any[];
  rejectedApplications: any[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalsTabs = ({
  pendingApplications,
  myInvites,
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
          Pending Proposals
        </TabsTrigger>
        <TabsTrigger 
          value="invites" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Send className="w-4 h-4" />
          My Invites
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
      
      <TabsContent value="invites" className="mt-6">
        <ProposalsList
          applications={myInvites}
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