import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: string;
  title: string;
  description: string;
}

interface CampaignSelectionProps {
  campaigns: Campaign[] | null;
  onBack: () => void;
  onSelect: (campaignId: string) => void;
}

const CampaignSelection = ({ campaigns, onBack, onSelect }: CampaignSelectionProps) => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/brand/campaigns/new');
  };

  return (
    <div className="p-8 space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 hover:bg-white/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Button>

      <h3 className="text-xl font-semibold text-nino-text">Select Campaign</h3>
      
      {campaigns && campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-6 border-2 border-white bg-white/50 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer group"
              onClick={() => onSelect(campaign.id)}
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
        <div className="text-center py-12 bg-white/50 rounded-xl border-2 border-white">
          <p className="text-nino-gray mb-6">No active campaigns found</p>
          <Button
            onClick={handleCreateCampaign}
            className="gap-2 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Create New Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignSelection;