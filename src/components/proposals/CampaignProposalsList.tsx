import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CampaignProposalsListProps {
  campaignId: string;
}

const CampaignProposalsList = ({ campaignId }: CampaignProposalsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: proposals, isLoading } = useQuery({
    queryKey: ['campaign-proposals', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          creator:creators (
            id,
            bio,
            location,
            instagram,
            website,
            user_id
          )
        `)
        .eq('opportunity_id', campaignId);

      if (error) throw error;

      // Fetch profiles separately since we need to join through user_id
      if (data) {
        const creatorUserIds = data
          .map(app => app.creator?.user_id)
          .filter((id): id is string => id != null);

        if (creatorUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', creatorUserIds);

          return data.map(application => ({
            ...application,
            creator: application.creator ? {
              ...application.creator,
              profile: profiles?.find(p => p.id === application.creator.user_id) || null
            } : null
          }));
        }
      }

      return data || [];
    },
  });

  const handleDelete = async (proposalId: string) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', proposalId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete proposal. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Proposal deleted successfully.",
    });
  };

  const handleChat = (creatorId: string) => {
    navigate(`/messages?user=${creatorId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No proposals found for this campaign.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {proposal.creator?.profile?.first_name} {proposal.creator?.profile?.last_name}
                </h3>
                {proposal.creator?.location && (
                  <p className="text-sm text-gray-500">{proposal.creator.location}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChat(proposal.creator?.user_id || '')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/creators/${proposal.creator?.id}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(proposal.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            {proposal.cover_letter && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {proposal.cover_letter}
                </p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CampaignProposalsList;