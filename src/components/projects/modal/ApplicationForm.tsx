import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from "./SuccessModal";

export interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    perks: string[] | null;
    requirements: string[] | null;
    payment_details: string | null;
    compensation_details: string | null;
    deliverables: string[] | null;
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
      description: string;
      website: string;
      instagram: string;
    };
  };
  onClose: () => void;
}

const ApplicationForm = ({ opportunity, onClose }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to apply",
          variant: "destructive",
        });
        return;
      }

      // Get the creator profile for the current user
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (creatorError || !creatorData) {
        toast({
          title: "Error",
          description: "Could not find your creator profile",
          variant: "destructive",
        });
        return;
      }

      // Check if application already exists
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('creator_id', creatorData.id)
        .single();

      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this opportunity",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit the application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunity.id,
          creator_id: creatorData.id,
          cover_letter: coverLetter,
          status: 'pending'
        });

      if (applicationError) {
        throw applicationError;
      }

      setShowSuccessModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccessModal) {
    return (
      <SuccessModal 
        isOpen={showSuccessModal} 
        onOpenChange={(open) => {
          setShowSuccessModal(open);
          if (!open) onClose();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Apply to {opportunity.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tell {opportunity.brand.company_name} why you'd be a great fit for this opportunity.
        </p>
      </div>

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