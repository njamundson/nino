import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox } from "lucide-react";
import ProposalsList from "./ProposalsList";

interface ProposalsTabsProps {
  pendingApplications: any[];
  myInvites: any[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalsTabs = ({
  pendingApplications,
  myInvites,
  isLoading,
  onUpdateStatus
}: ProposalsTabsProps) => {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px] p-1 rounded-full bg-nino-bg">
        <TabsTrigger 
          value="pending" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Inbox className="w-4 h-4" />
          Pending Proposals
        </TabsTrigger>
        <TabsTrigger 
          value="applications" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Send className="w-4 h-4" />
          My Applications
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        <ProposalsList
          applications={pendingApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
        />
      </TabsContent>
      
      <TabsContent value="applications" className="mt-6">
        <ProposalsList
          applications={myInvites}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsTabs;