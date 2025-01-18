import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CampaignDates } from "./CampaignDates";

interface CampaignFormProps {
  formData: {
    title: string;
    description: string;
    requirements: string[];
    location: string;
    payment_details: string;
    compensation_details: string;
    start_date: string | null;
    end_date: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDateSelect: (field: 'start_date' | 'end_date') => (date: Date | undefined) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClose: () => void;
}

const CampaignForm = ({
  formData,
  handleChange,
  handleDateSelect,
  handleSubmit,
  isLoading,
  onClose
}: CampaignFormProps) => {
  return (
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

      <CampaignDates
        startDate={formData.start_date}
        endDate={formData.end_date}
        onStartDateSelect={handleDateSelect('start_date')}
        onEndDateSelect={handleDateSelect('end_date')}
      />

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
  );
};

export default CampaignForm;