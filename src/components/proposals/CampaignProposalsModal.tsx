import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CampaignProposalsList from "./CampaignProposalsList";

interface CampaignProposalsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignTitle: string;
}

const CampaignProposalsModal = ({
  isOpen,
  onOpenChange,
  campaignId,
  campaignTitle,
}: CampaignProposalsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposals for {campaignTitle}</DialogTitle>
        </DialogHeader>
        <CampaignProposalsList campaignId={campaignId} />
      </DialogContent>
    </Dialog>
  );
};

export default CampaignProposalsModal;