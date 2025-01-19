import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";
import ApplicationFormHeader from "./ApplicationFormHeader";

export interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
    brand: {
      company_name: string;
    };
  };
  onClose: () => void;
}

const ApplicationForm = ({ opportunity, onClose }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const { isSubmitting, submitApplication } = useApplicationSubmit({
    opportunityId: opportunity.id,
    onClose,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitApplication(coverLetter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ApplicationFormHeader 
        title={opportunity.title}
        companyName={opportunity.brand.company_name}
      />

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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;