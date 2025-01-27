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
import { Loader2 } from "lucide-react";

interface AcceptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
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
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className="relative"
          >
            {isProcessing && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin absolute left-4" />
            )}
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptDialog;