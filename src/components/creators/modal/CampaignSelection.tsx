import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  payment_details: string | null;
  compensation_details: string | null;
  brands: {
    company_name: string | null;
  } | null;
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
        
        {campaigns && campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 border border-white/20 bg-white/50 rounded-xl transition-all duration-300 ${
                  !isLoading ? 'hover:bg-white hover:border-white cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => !isLoading && onSelect(campaign.id)}
              >
                <h4 className="font-medium text-lg text-nino-text group-hover:text-nino-primary transition-colors">
                  {campaign.title}
                </h4>
                {campaign.brands?.company_name && (
                  <p className="text-sm text-nino-gray mt-1">
                    {campaign.brands.company_name}
                  </p>
                )}
                <p className="text-sm text-nino-gray mt-2">
                  {campaign.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {campaign.location && (
                    <div className="flex items-center gap-1 text-xs text-nino-gray">
                      <MapPin className="w-3 h-3" />
                      <span>{campaign.location}</span>
                    </div>
                  )}
                  {(campaign.start_date || campaign.end_date) && (
                    <div className="flex items-center gap-1 text-xs text-nino-gray">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {campaign.start_date && formatDate(campaign.start_date)}
                        {campaign.end_date && ` - ${formatDate(campaign.end_date)}`}
                      </span>
                    </div>
                  )}
                </div>
                {(campaign.payment_details || campaign.compensation_details) && (
                  <div className="mt-3 text-xs text-nino-gray">
                    {campaign.payment_details && <span>💰 {campaign.payment_details}</span>}
                    {campaign.compensation_details && (
                      <span className="ml-3">🎁 {campaign.compensation_details}</span>
                    )}
                  </div>
                )}
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