import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface SuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepActive?: () => void;
  onClose?: () => void;
}

const SuccessModal = ({ isOpen, onOpenChange, onKeepActive, onClose }: SuccessModalProps) => {
  const navigate = useNavigate();

  const handleKeepActive = () => {
    if (onKeepActive) {
      onKeepActive();
    }
    onOpenChange(false);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
    navigate("/brand/creators");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-6 p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-sm opacity-50"></div>
            <CheckCircle2 className="h-16 w-16 text-green-500 relative animate-scale-in" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900">
              Success!
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Do you need more creators for this campaign, or should we close this project posting?
            </p>
          </div>
          <div className="flex gap-4 w-full mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleKeepActive}
            >
              Keep Active
            </Button>
            <Button
              className="flex-1"
              onClick={handleClose}
            >
              Close Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;