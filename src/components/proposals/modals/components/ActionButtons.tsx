import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ActionButtonsProps {
  type: 'proposal' | 'application';
  isDeleting: boolean;
  isDeclining: boolean;
  onDecline: () => void;
  onDelete: () => void;
  onApply: () => void;
  hasCoverLetter: boolean;
  onUpdateStatus?: (status: 'accepted' | 'rejected') => Promise<void>;
}

const ActionButtons = ({
  type,
  isDeleting,
  isDeclining,
  onDecline,
  onDelete,
  onApply,
  hasCoverLetter,
  onUpdateStatus
}: ActionButtonsProps) => {
  if (type === 'proposal' && !hasCoverLetter) {
    return (
      <div className="flex gap-3 mt-6">
        <Button onClick={onApply} className="flex-1">
          Apply Now
        </Button>
        <Button 
          variant="outline" 
          onClick={onDecline}
          disabled={isDeclining}
          className="flex-1"
        >
          {isDeclining ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Declining...
            </>
          ) : (
            "Not Interested"
          )}
        </Button>
      </div>
    );
  }

  if (type === 'application' && onUpdateStatus) {
    return (
      <div className="flex gap-3 mt-6">
        <Button 
          onClick={() => onUpdateStatus('accepted')}
          className="flex-1"
        >
          Accept
        </Button>
        <Button 
          variant="outline"
          onClick={() => onUpdateStatus('rejected')}
          className="flex-1"
        >
          Reject
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mt-6">
      <Button
        variant="outline"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Deleting...
          </>
        ) : (
          "Delete Application"
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;