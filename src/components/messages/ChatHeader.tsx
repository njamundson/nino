import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  onBack?: () => void;
}

export const ChatHeader = ({ 
  senderFirstName, 
  senderLastName,
  onBack 
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="border-b border-gray-100 p-4">
      <div className="flex items-center gap-3">
        {isMobile && onBack && (
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h2 className="font-semibold text-gray-900">
          {senderFirstName} {senderLastName}
        </h2>
      </div>
    </div>
  );
};