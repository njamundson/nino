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

  // Filter out accepted applications since they should be in Bookings
  const activeApplications = myApplications.filter(app => app.status !== 'accepted');

  // Show brand-initiated applications in Pending tab
  const pendingInvitations = activeApplications.filter(app => 
    app.initiated_by === 'brand' && 
    (app.status === 'invited' || app.status === 'pending') &&
    !app.cover_letter // Only show invitations that haven't been responded to yet
  );
  
  // Show creator-initiated applications and responded-to invitations in Applied tab
  const userApplications = activeApplications.filter(app => 
    app.initiated_by === 'creator' || 
    (app.initiated_by === 'brand' && app.cover_letter) // Include brand invitations that have been responded to
  );

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