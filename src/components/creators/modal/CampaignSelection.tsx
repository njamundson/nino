import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  status: string;
  end_date: string | null;
}

interface CampaignSelectionProps {
  campaigns: Campaign[] | undefined;
  onBack: () => void;
  onSelect: (campaignId: string) => void;
  isLoading?: boolean;
}

const CampaignSelection = ({ campaigns, onBack, onSelect, isLoading = false }: CampaignSelectionProps) => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/brand/campaigns/new');
  };

  // Filter to only show active campaigns
  const activeCampaigns = campaigns?.filter(campaign => {
    // Check if campaign is open or active
    if (campaign.status !== 'open' && campaign.status !== 'active') {
      return false;
    }

    // Check if campaign has not ended
    if (campaign.end_date) {
      const endDate = new Date(campaign.end_date);
      if (endDate < new Date()) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="sticky top-0 bg-nino-bg z-10 p-6 pb-4 border-b border-white/50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hover:bg-white/50"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-nino-text">Select Campaign</h3>
        
        {activeCampaigns && activeCampaigns.length > 0 ? (
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 border-2 border-white bg-white/50 rounded-xl transition-all duration-300 ${
                  !isLoading ? 'hover:bg-white cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => !isLoading && onSelect(campaign.id)}
              >
                <h4 className="font-medium text-lg text-nino-text group-hover:text-nino-primary transition-colors">
                  {campaign.title}
                </h4>
                <p className="text-sm text-nino-gray mt-1">
                  {campaign.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/50 rounded-xl border-2 border-white">
            <p className="text-nino-gray mb-6">No active campaigns found</p>
            <Button
              onClick={handleCreateCampaign}
              className="gap-2 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Create New Campaign
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-sm">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignSelection;