import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
    start_date: string | null;
    end_date: string | null;
  };
}

const EditCampaignModal = ({ isOpen, onClose, campaign }: EditCampaignModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    requirements: campaign.requirements,
    location: campaign.location || "",
    payment_details: campaign.payment_details || "",
    compensation_details: campaign.compensation_details || "",
    start_date: campaign.start_date || null,
    end_date: campaign.end_date || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDateSelect = (field: 'start_date' | 'end_date') => (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? date.toISOString() : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          payment_details: formData.payment_details,
          compensation_details: formData.compensation_details,
          start_date: formData.start_date,
          end_date: formData.end_date,
        })
        .eq('id', campaign.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Edit Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
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
                        !formData.start_date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {formData.start_date ? (
                        format(new Date(formData.start_date), "MMMM do, yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date ? new Date(formData.start_date) : undefined}
                      onSelect={handleDateSelect('start_date')}
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
                        !formData.end_date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {formData.end_date ? (
                        format(new Date(formData.end_date), "MMMM do, yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.end_date ? new Date(formData.end_date) : undefined}
                      onSelect={handleDateSelect('end_date')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="payment_details" className="text-sm font-medium">Payment Details</label>
            <Input
              id="payment_details"
              name="payment_details"
              value={formData.payment_details}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="compensation_details" className="text-sm font-medium">Compensation Details</label>
            <Input
              id="compensation_details"
              name="compensation_details"
              value={formData.compensation_details}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignModal;