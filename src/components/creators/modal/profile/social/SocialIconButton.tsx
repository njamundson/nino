import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialIconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  tooltipText: string;
  isActive: boolean;
}

const SocialIconButton = ({ 
  icon: Icon, 
  onClick, 
  tooltipText, 
  isActive 
}: SocialIconButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`p-3 rounded-2xl ${isActive ? 'bg-white/40 cursor-pointer' : 'bg-white/20 cursor-not-allowed'} transition-all duration-300 shadow-sm backdrop-blur-sm`}
            onClick={onClick}
            disabled={!isActive}
          >
            <Icon 
              className={`w-[18px] h-[18px] ${isActive ? 'text-nino-primary/80' : 'text-nino-gray/50'}`}
              strokeWidth={1.25} 
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SocialIconButton;