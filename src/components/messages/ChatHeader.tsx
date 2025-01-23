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
    <div className="border-b border-gray-100 p-6 bg-white/50 backdrop-blur-xl">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          {isMobile && onBack && (
            <button 
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {senderFirstName} {senderLastName}
            </h1>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            {senderFirstName} {senderLastName}
          </h2>
        </div>
      </div>
    </div>
  );
};