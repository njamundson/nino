import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox } from "lucide-react";
import ProposalsList from "./ProposalsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/integrations/supabase/types/application";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProposalsTabsProps {
  pendingProposals: Application[];
  myApplications: Application[];
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
  const queryClient = useQueryClient();

  // Set up real-time subscription for applications
  useEffect(() => {
    console.log('Setting up real-time subscription for applications');
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        (payload) => {
          console.log('Application change detected:', payload);
          // Refetch both queries to ensure all tabs are updated
          queryClient.invalidateQueries({ queryKey: ['applications'] });
          queryClient.invalidateQueries({ queryKey: ['my-applications'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Filter for pending invitations from brands (no cover letter yet)
  const pendingInvitations = pendingProposals.filter(app => {
    const isPendingInvitation = 
      app.initiated_by === 'brand' && 
      !app.cover_letter &&
      app.status === 'pending';
    
    console.log('Checking invitation:', app.id, 'isPendingInvitation:', isPendingInvitation);
    return isPendingInvitation;
  });

  // Filter for all submitted applications (both direct and responses to invitations)
  const activeApplications = myApplications.filter(app => {
    const isActiveApplication = 
      app.cover_letter && 
      app.status === 'pending';
    
    console.log('Checking application:', app.id, 'isActiveApplication:', isActiveApplication);
    return isActiveApplication;
  });

  console.log('All applications:', myApplications);
  console.log('Filtered - Pending Invitations:', pendingInvitations);
  console.log('Filtered - Active Applications:', activeApplications);

  return (
    <Tabs defaultValue="invitations" className="w-full">
      <TabsList className="grid w-full grid-cols-2 p-1 rounded-full bg-nino-bg">
        <TabsTrigger 
          value="invitations" 
          className="rounded-full data-[state=active]:bg-white flex items-center justify-center gap-2 transition-all duration-300 px-3 py-2"
        >
          <Inbox className="w-4 h-4 shrink-0" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-nowrap`}>
            Invitations ({pendingInvitations.length})
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="applications" 
          className="rounded-full data-[state=active]:bg-white flex items-center justify-center gap-2 transition-all duration-300 px-3 py-2"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-nowrap`}>
            Applications ({activeApplications.length})
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="invitations" className="mt-4">
        <ProposalsList
          applications={pendingInvitations}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="proposal"
        />
      </TabsContent>
      
      <TabsContent value="applications" className="mt-4">
        <ProposalsList
          applications={activeApplications}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          type="application"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsTabs;