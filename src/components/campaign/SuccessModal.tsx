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
      <DialogContent className="sm:max-w-[400px] p-0 bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <div className="flex flex-col items-center justify-center space-y-6 p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100/50 rounded-full blur-xl"></div>
            <CheckCircle2 className="h-16 w-16 text-green-500 relative animate-scale-in" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900">
              Campaign Created Successfully
            </h2>
            <p className="text-gray-500 text-base">
              Invite creators to apply!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;