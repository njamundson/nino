import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessModal = ({ isOpen, onOpenChange }: SuccessModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        navigate("/brand/creators");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h2 className="text-2xl font-semibold text-center">
            Campaign Created Successfully!
          </h2>
          <p className="text-gray-500 text-center">
            Invite creators to apply!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;