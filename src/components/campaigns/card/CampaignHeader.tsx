import { Button } from "@/components/ui/button";
import { ListChecks, MapPin, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Application } from "@/integrations/supabase/types/opportunity";

interface CampaignHeaderProps {
  title: string;
  location: string | null;
  isCompleted: boolean;
  applications: Application[];
  onEdit: () => void;
  onDelete: () => void;
  onViewCreator: (creator: any, application: any) => void;
}

const CampaignHeader = ({
  title,
  location,
  isCompleted,
  applications,
  onEdit,
  onDelete,
  onViewCreator,
}: CampaignHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1 flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-semibold text-nino-text truncate pr-2">
          {title}
        </h3>
        {location && (
          <p className="text-nino-gray flex items-center gap-1.5 text-sm sm:text-base">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {applications.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <ListChecks className="h-4 w-4" />
                <span className="sr-only">View applications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white">
              <div className="px-2 py-1.5 text-sm font-semibold">
                Applications ({applications.length})
              </div>
              <DropdownMenuSeparator />
              {applications.map((application) => (
                <DropdownMenuItem
                  key={application.id}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                  onClick={() => onViewCreator(application.creator, application)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {application.creator?.first_name} {application.creator?.last_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!isCompleted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={onEdit}>
                Edit campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={onDelete}
              >
                Delete campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default CampaignHeader;