import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onAccept: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}

const ActionButtons = ({ onAccept, onReject, isProcessing }: ActionButtonsProps) => {
  return (
    <div className="space-y-4 mt-auto">
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onAccept}
          disabled={isProcessing}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white py-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-[#E5DEFF]"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <CheckSquare className="w-5 h-5 mr-2" />
          )}
          Accept
        </Button>
        <Button
          onClick={onReject}
          disabled={isProcessing}
          variant="outline"
          className="border-2 border-[#D6BCFA] text-[#6E59A5] hover:bg-[#E5DEFF] py-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300"
        >
          <XSquare className="w-5 h-5 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;