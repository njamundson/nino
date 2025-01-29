import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailsProps {
  opportunity: {
    id: string;
    title: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
  };
  onRefresh?: () => void;
}

const ProjectDetails = ({ opportunity, onRefresh }: ProjectDetailsProps) => {
  const { toast } = useToast();
  
  const getStatusMessage = (status: string) => {
    return status === 'open' ? 'Campaign is still hiring creators.' : 'Campaign is done hiring creators';
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('id', opportunity.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Campaign status changed to ${newStatus}`,
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {opportunity.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Badge 
                  variant="secondary" 
                  className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20 inline-flex items-center gap-1"
                >
                  {getStatusMessage(opportunity.status)}
                  <ChevronDown className="h-3 w-3" />
                </Badge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] bg-white">
              <DropdownMenuItem 
                onClick={() => handleStatusChange('open')}
                className="cursor-pointer"
              >
                Campaign is still hiring creators.
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('closed')}
                className="cursor-pointer"
              >
                Campaign is done hiring creators
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
        {(opportunity.start_date || opportunity.end_date) && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {opportunity.start_date && formatDate(opportunity.start_date)}
              {opportunity.start_date && opportunity.end_date && " - "}
              {opportunity.end_date && formatDate(opportunity.end_date)}
            </span>
          </div>
        )}

        {opportunity.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{opportunity.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;