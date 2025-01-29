import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingDetailsProps {
  isOpen: boolean;
  onToggle: () => void;
  startDate: string;
  endDate: string;
  description: string;
  requirements?: string[];
  perks?: string[];
}

const BookingDetails = ({
  isOpen,
  onToggle,
  startDate,
  endDate,
  description,
  requirements,
  perks,
}: BookingDetailsProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
        >
          View Details
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isOpen && "transform rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out bg-white">
        <div className="space-y-4 p-4">
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-gray-500">
              {new Date(startDate).toLocaleDateString()} -{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          {requirements && requirements.length > 0 && (
            <div>
              <p className="text-sm font-medium">Requirements</p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                {requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          {perks && perks.length > 0 && (
            <div>
              <p className="text-sm font-medium">Perks</p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                {perks.map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BookingDetails;