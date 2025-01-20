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
          className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
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
          className="border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <XSquare className="w-5 h-5 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;