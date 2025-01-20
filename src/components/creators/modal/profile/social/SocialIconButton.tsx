import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialIconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  tooltipText: string;
  isActive: boolean;
  label?: string;
}

const SocialIconButton = ({ 
  icon: Icon, 
  onClick, 
  tooltipText, 
  isActive,
  label
}: SocialIconButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-white hover:bg-white/90 cursor-pointer shadow-sm hover:shadow-md' 
                : 'bg-white/20 cursor-not-allowed opacity-50'
              }
            `}
            onClick={onClick}
            disabled={!isActive}
          >
            <Icon 
              className={`w-[18px] h-[18px] ${isActive ? 'text-nino-primary' : 'text-nino-gray/50'}`}
              strokeWidth={1.25} 
            />
            {label && (
              <span className={`text-sm font-medium ${isActive ? 'text-nino-text' : 'text-nino-gray/50'}`}>
                {label}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SocialIconButton;