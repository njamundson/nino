import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";
import ApplicationFormHeader from "./ApplicationFormHeader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
    brand?: {
      company_name: string;
    } | null;
  };
  onClose: () => void;
  onBack: () => void;
  onModalClose: () => void;
}

const ApplicationForm = ({ opportunity, onClose, onBack, onModalClose }: ApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: existingApplication, isLoading } = useQuery({
    queryKey: ['existing-application', opportunity.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creator) return null;

      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('opportunity_id', opportunity.id)
        .eq('creator_id', creator.id)
        .maybeSingle();

      return data;
    }
  });

  const { isSubmitting, submitApplication } = useApplicationSubmit({
    opportunityId: opportunity.id,
    onClose: () => {
      onClose();
      onModalClose();
      navigate("/creator/projects");
    },
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

    if (existingApplication && existingApplication.status !== 'rejected') {
      toast({
        title: "Already Applied",
        description: "You have already applied to this opportunity.",
        variant: "destructive",
      });
      return;
    }

    await submitApplication(coverLetter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 border-2 border-nino-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (existingApplication && existingApplication.status !== 'rejected') {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Application Already Submitted</h3>
        <p className="text-gray-600">
          You have already applied to this opportunity. You can only submit a new application if your previous one was rejected.
        </p>
        <Button onClick={onModalClose} variant="outline" className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ApplicationFormHeader 
        title={opportunity.title}
        companyName={opportunity.brand?.company_name || "Unknown Company"}
      />

      <div className="px-8 pb-8 space-y-6">
        <div className="space-y-4">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <Textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're interested in this opportunity and what makes you a great fit..."
            className="min-h-[200px] resize-none border-gray-200 rounded-xl focus:ring-nino-primary focus:border-nino-primary"
            required
          />
        </div>

        <div className="flex justify-between pt-4 gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ApplicationForm;