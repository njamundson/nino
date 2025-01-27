import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ApplicationsHeaderProps {
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ApplicationsHeader = ({ count, isExpanded, onToggle }: ApplicationsHeaderProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-between"
      onClick={onToggle}
    >
      <span className="font-medium">
        Applications ({count})
      </span>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ApplicationsHeader;