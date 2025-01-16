import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  companyName: string;
  onClose: () => void;
}

const SuccessModal = ({ companyName, onClose }: SuccessModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <div className="flex flex-col items-center gap-4 py-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <DialogTitle className="text-2xl font-semibold">
            Application Submitted!
          </DialogTitle>
          <p className="text-muted-foreground">
            Your application has been sent to {companyName}. 
            You'll be notified when they review your application.
          </p>
          <Button onClick={onClose} className="mt-4">
            View Other Opportunities
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;