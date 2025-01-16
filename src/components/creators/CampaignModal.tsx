import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

const CampaignModal = ({ isOpen, onClose, creatorName }: CampaignModalProps) => {
  const navigate = useNavigate();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data: brands } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!brands?.id) return [];

      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('brand_id', brands.id)
        .eq('status', 'open');

      return data || [];
    },
  });

  const handleCreateCampaign = () => {
    navigate('/brand/campaigns/new');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-[#282828]">
            Invite {creatorName} to Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#A55549]" />
            </div>
          ) : !campaigns?.length ? (
            <div className="space-y-4 text-center">
              <p className="text-[#282828]/70">
                You don't have any active campaigns yet.
              </p>
              <Button
                onClick={handleCreateCampaign}
                className="inline-flex items-center gap-2 bg-[#A55549] text-white hover:bg-[#A55549]/90"
              >
                <Plus className="h-4 w-4" />
                Create New Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  className="w-full rounded-xl border border-[#F9F6F2] bg-white p-4 text-left transition-all hover:border-[#A55549]/20 hover:bg-[#F9F6F2]"
                >
                  <h3 className="font-medium text-[#282828]">{campaign.title}</h3>
                  {campaign.description && (
                    <p className="mt-1 text-sm text-[#282828]/70 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignModal;