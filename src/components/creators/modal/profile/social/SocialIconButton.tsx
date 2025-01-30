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
            onClick={onClick}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-white/40 hover:bg-white/90 cursor-pointer' 
                : 'bg-white/20 cursor-not-allowed'
            }`}
            disabled={!isActive}
          >
            <Icon 
              className={`w-[18px] h-[18px] ${
                isActive 
                  ? 'text-nino-primary/80 group-hover:text-nino-primary' 
                  : 'text-nino-gray/50'
              }`}
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