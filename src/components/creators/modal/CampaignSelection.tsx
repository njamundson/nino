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
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="sticky top-0 bg-nino-bg z-10 p-6 pb-4 border-b border-white/50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-nino-text">Select Campaign</h3>
        
        {campaigns && campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 border-2 border-white bg-white/50 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer group"
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
          <div className="text-center py-8 bg-white/50 rounded-xl border-2 border-white">
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
    </div>
  );
};

export default CampaignSelection;