import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox } from "lucide-react";
import ProposalsList from "./ProposalsList";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProposalsTabsProps {
  pendingProposals: any[];
  myApplications: any[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalsTabs = ({
  pendingProposals,
  myApplications,
  isLoading,
  onUpdateStatus
}: ProposalsTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:w-[400px]'} p-1 rounded-full bg-nino-bg`}>
        <TabsTrigger 
          value="pending" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Inbox className="w-4 h-4" />
          <span className={`${isMobile ? 'text-sm' : ''}`}>
            Pending Proposals ({pendingProposals.length})
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="applications" 
          className="rounded-full data-[state=active]:bg-white flex items-center gap-2 transition-all duration-300"
        >
          <Send className="w-4 h-4" />
          <span className={`${isMobile ? 'text-sm' : ''}`}>
            My Applications ({myApplications.length})
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
        <ProposalsList
          applications={pendingProposals}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="proposal"
        />
      </TabsContent>
      
      <TabsContent value="applications" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
        <ProposalsList
          applications={myApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="application"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsTabs;