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

  // Show brand-initiated applications that are still pending in the Pending tab
  const pendingInvitations = myApplications.filter(app => 
    app.initiated_by === 'brand' && app.status === 'pending'
  );
  
  // Show creator-initiated applications and brand invitations that have been acted upon
  const userApplications = myApplications.filter(app => 
    app.initiated_by === 'creator' || 
    (app.initiated_by === 'brand' && app.status !== 'pending')
  );

  console.log('Pending invitations:', pendingInvitations);
  console.log('User applications:', userApplications);

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-2 p-1 rounded-full bg-nino-bg">
        <TabsTrigger 
          value="pending" 
          className="rounded-full data-[state=active]:bg-white flex items-center justify-center gap-2 transition-all duration-300 px-3 py-2"
        >
          <Inbox className="w-4 h-4 shrink-0" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-nowrap`}>
            Pending Invitations ({pendingInvitations.length})
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="applications" 
          className="rounded-full data-[state=active]:bg-white flex items-center justify-center gap-2 transition-all duration-300 px-3 py-2"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-nowrap`}>
            Applied ({userApplications.length})
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-4">
        <ProposalsList
          applications={pendingInvitations}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="proposal"
        />
      </TabsContent>
      
      <TabsContent value="applications" className="mt-4">
        <ProposalsList
          applications={userApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="application"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsTabs;