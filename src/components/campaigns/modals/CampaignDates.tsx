import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CampaignDatesProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateSelect: (date: Date | undefined) => void;
  onEndDateSelect: (date: Date | undefined) => void;
}

export const CampaignDates = ({
  startDate,
  endDate,
  onStartDateSelect,
  onEndDateSelect,
}: CampaignDatesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Campaign Duration</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-full border-gray-200 hover:bg-gray-50/50 hover:border-gray-300 transition-colors",
                  !startDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                {startDate ? (
                  format(new Date(startDate), "MMMM do, yyyy")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={onStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-full border-gray-200 hover:bg-gray-50/50 hover:border-gray-300 transition-colors",
                  !endDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                {endDate ? (
                  format(new Date(endDate), "MMMM do, yyyy")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={onEndDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};