import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    perks: string[];
    requirements: string[];
    payment_details: string;
    compensation_details: string;
    deliverables: string[];
    brand: {
      company_name: string;
      description: string;
      website: string;
      instagram: string;
    };
  };
  onBack: () => void;
  onClose: () => void;
  onSubmit: (coverLetter: string) => void;
}

const ApplicationForm = ({ opportunity, onBack, onClose, onSubmit }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(coverLetter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="coverLetter" className="text-sm font-medium">
          Cover Letter
        </label>
        <Textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell us why you're interested in this opportunity..."
          className="h-40"
          required
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit Application</Button>
        </div>
      </div>
    </form>
  );
};

export default ApplicationForm;