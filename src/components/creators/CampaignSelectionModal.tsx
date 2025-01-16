import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
}

const CampaignSelectionModal = ({ isOpen, onClose, creatorId }: CampaignSelectionModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) return [];

      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('brand_id', brand.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const handleInvite = async () => {
    if (selectedCampaigns.length === 0) {
      toast({
        title: "No campaigns selected",
        description: "Please select at least one campaign to invite the creator.",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the invitation logic
    toast({
      title: "Invitation sent",
      description: "The creator has been invited to the selected campaigns.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[24px] border-0 bg-nino-bg p-6 shadow-xl">
        <DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-nino-gray hover:text-nino-text"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <DialogTitle className="text-center text-xl font-semibold text-nino-text">
            Select Campaigns
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-nino-gray">Loading campaigns...</p>
          ) : campaigns && campaigns.length > 0 ? (
            <>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <label
                    key={campaign.id}
                    className="flex cursor-pointer items-center space-x-3 rounded-xl border border-transparent bg-white p-4 transition-all duration-200 hover:border-nino-primary/10"
                  >
                    <Checkbox
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                        }
                      }}
                      className="border-nino-primary/20 data-[state=checked]:bg-nino-primary data-[state=checked]:text-white"
                    />
                    <span className="text-sm font-medium text-nino-text">
                      {campaign.title}
                    </span>
                  </label>
                ))}
              </div>
              <Button
                onClick={handleInvite}
                className="mt-6 w-full bg-nino-primary text-white hover:bg-nino-primary/90"
              >
                Invite to Selected Campaigns
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-nino-gray">No active campaigns found</p>
              <Button
                onClick={() => navigate('/brand/campaigns/new')}
                className="inline-flex items-center gap-2 bg-nino-primary text-white hover:bg-nino-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create New Campaign
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignSelectionModal;