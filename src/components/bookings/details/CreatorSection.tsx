import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserRound, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface CreatorSectionProps {
  creator: {
    first_name: string;
    last_name: string | null;
    profile_image_url: string | null;
  };
  onChatClick: () => void;
  onViewCreator: () => void;
}

const CreatorSection = ({ creator, onChatClick, onViewCreator }: CreatorSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Since first_name is required in the database, we can be confident it exists
  const creatorName = creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : creator.first_name;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-t pt-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full bg-white hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 ease-in-out">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900">Booked Creator</h4>
            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
              Active
            </Badge>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
          <div className="pt-4 space-y-4 bg-white">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group transition-all duration-200 ease-in-out">
              <div className="flex items-center gap-4">
                {creator.profile_image_url ? (
                  <img 
                    src={creator.profile_image_url}
                    alt={creatorName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white">
                    <span className="text-lg font-medium text-nino-primary">
                      {creator.first_name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{creatorName}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onChatClick}
                        className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chat with Creator</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onViewCreator}
                        className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                      >
                        <UserRound className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CreatorSection;