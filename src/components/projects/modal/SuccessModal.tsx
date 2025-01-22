import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessModal = ({ isOpen, onOpenChange }: SuccessModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-6 p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-sm opacity-50" />
            <CheckCircle2 className="h-16 w-16 text-green-500 relative animate-bounce" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900">
              Application Submitted!
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Your application has been sent successfully. You'll be notified when the brand reviews it.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;