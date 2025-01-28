import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface BasicInfoProps {
  formData: {
    title: string;
    description: string;
    location: string;
    startDate: string | null;
    endDate: string | null;
  };
  setFormData: (data: any) => void;
}

const BasicInfo = ({ formData, setFormData }: BasicInfoProps) => {
  const handleDateSelect = (field: string) => (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [field]: date.toISOString() });
    }
  };

  const [showDates, setShowDates] = useState(
    !!(formData.startDate || formData.endDate)
  );

  const handleToggleDates = (checked: boolean) => {
    setShowDates(checked);
    if (!checked) {
      setFormData({
        ...formData,
        startDate: null,
        endDate: null,
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Project Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter the title of your campaign"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Project Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your campaign in detail"
          className="min-h-[160px] text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 resize-none placeholder:text-gray-400 leading-relaxed"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
        <Input
          id="location"
          placeholder="Where will this project take place?"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Project Timeline</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={showDates}
              onCheckedChange={handleToggleDates}
              className="data-[state=checked]:bg-gray-900"
            />
            <span className="text-sm text-gray-600">
              {showDates ? "Specify dates" : "No specific dates"}
            </span>
          </div>
        </div>

        {showDates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:bg-gray-50/80 focus:ring-2 focus:ring-gray-300 transition-all duration-200",
                      !formData.startDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                    {formData.startDate ? (
                      format(new Date(formData.startDate), "MMMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={handleDateSelect("startDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:bg-gray-50/80 focus:ring-2 focus:ring-gray-300 transition-all duration-200",
                      !formData.endDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                    {formData.endDate ? (
                      format(new Date(formData.endDate), "MMMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate ? new Date(formData.endDate) : undefined}
                    onSelect={handleDateSelect("endDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;