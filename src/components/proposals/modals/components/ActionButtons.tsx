import { Button } from "@/components/ui/button";
import { X, CheckCircle2, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  type: 'proposal' | 'application';
  isDeleting: boolean;
  isDeclining: boolean;
  onDecline: () => void;
  onDelete: () => void;
  onApply: () => void;
  hasCoverLetter: boolean;
}

const ActionButtons = ({ 
  type, 
  isDeleting, 
  isDeclining, 
  onDecline, 
  onDelete, 
  onApply,
  hasCoverLetter 
}: ActionButtonsProps) => {
  if (type === 'proposal') {
    return (
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onDecline}
          disabled={isDeclining}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          {isDeclining ? 'Declining...' : 'Not Interested'}
        </Button>
        <Button 
          onClick={onApply}
          className="bg-[#A55549] hover:bg-[#A55549]/90 text-white gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Apply Now
        </Button>
      </div>
    );
  }

  return type === 'application' && hasCoverLetter ? (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="destructive"
        onClick={onDelete}
        disabled={isDeleting}
        className="gap-2"
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? 'Deleting...' : 'Delete Application'}
      </Button>
    </div>
  ) : null;
};

export default ActionButtons;