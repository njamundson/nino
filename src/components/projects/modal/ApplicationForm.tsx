import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  onSubmit: (coverLetter: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ApplicationForm = ({ onSubmit, onCancel, isSubmitting }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");

  return (
    <div className="space-y-4 pt-4">
      <h4 className="font-medium">Your Application</h4>
      <Textarea
        placeholder="Write a cover letter explaining why you're a great fit for this opportunity..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        className="min-h-[200px]"
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(coverLetter)}
          disabled={!coverLetter.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationForm;