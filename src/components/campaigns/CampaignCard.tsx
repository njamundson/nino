import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApplicationActions } from "@/hooks/useApplicationActions";
import AcceptDialog from "./modals/profile/AcceptDialog";
import { Trash2 } from "lucide-react";

interface CampaignCardProps {
  campaign: any;
  onDelete?: () => void;
  onEdit?: (campaign: any) => void;  // Added this prop
}

const CampaignCard = ({ campaign, onDelete, onEdit }: CampaignCardProps) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  
  const { handleAcceptApplication, handleRejectApplication, isProcessing } = useApplicationActions();

  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleAcceptClick = async (application: any) => {
    setSelectedApplication(application);
    setShowAcceptDialog(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedApplication) return;
    
    const success = await handleAcceptApplication(selectedApplication.id);
    if (success) {
      setShowAcceptDialog(false);
      setSelectedApplication(null);
    }
  };

  const handleRejectClick = async (application: any) => {
    const success = await handleRejectApplication(application.id);
    if (success) {
      // UI will update automatically due to query invalidation
    }
  };

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{campaign.title}</h3>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(campaign)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{campaign.description}</p>
        
        {/* Application actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleRejectClick(selectedApplication)}
            disabled={isProcessing}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleAcceptClick(selectedApplication)}
            disabled={isProcessing}
          >
            Accept
          </Button>
        </div>
      </Card>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleConfirmAccept}
        creatorName={selectedApplication?.creator?.first_name || 'Creator'}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CampaignCard;