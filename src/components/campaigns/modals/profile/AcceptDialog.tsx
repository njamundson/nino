import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AcceptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (keepCampaignActive: boolean) => void;
  creatorName: string;
  isProcessing?: boolean;
}

const AcceptDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  creatorName,
  isProcessing 
}: AcceptDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Accept Creator's Proposal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to accept {creatorName}'s proposal? This will create a new booking and open a messaging thread with the creator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2">
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => onConfirm(false)}
              disabled={isProcessing}
              className="flex-1 relative"
              variant="default"
            >
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin absolute left-4" />
              )}
              Close Campaign
            </Button>
            <Button
              onClick={() => onConfirm(true)}
              disabled={isProcessing}
              className="flex-1 relative"
              variant="outline"
            >
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin absolute left-4" />
              )}
              Keep Campaign Active
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptDialog;