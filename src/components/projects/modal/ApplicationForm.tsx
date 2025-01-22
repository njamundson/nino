import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";
import ApplicationFormHeader from "./ApplicationFormHeader";
import { useToast } from "@/hooks/use-toast";

export interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
    brand?: {
      company_name: string;
    } | null;
  };
  onClose: () => void;
}

const ApplicationForm = ({ opportunity, onClose }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const { toast } = useToast();
  const { isSubmitting, submitApplication } = useApplicationSubmit({
    opportunityId: opportunity.id,
    onClose,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      toast({
        title: "Error",
        description: "Please write a cover letter before submitting.",
        variant: "destructive",
      });
      return;
    }

    await submitApplication(coverLetter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ApplicationFormHeader 
        title={opportunity.title}
        companyName={opportunity.brand?.company_name || "Unknown Company"}
      />

      <div className="space-y-2">
        <label htmlFor="coverLetter" className="text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <Textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell us why you're interested in this opportunity and what makes you a great fit..."
          className="h-40 resize-none"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Write a compelling cover letter that highlights your relevant experience and enthusiasm for this opportunity.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#a55549] hover:bg-[#a55549]/90"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;