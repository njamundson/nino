import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UseApplicationSubmitProps {
  opportunityId: string;
  onClose: () => void;
}

export const useApplicationSubmit = ({ opportunityId, onClose }: UseApplicationSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submitApplication = async (coverLetter: string) => {
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
        .maybeSingle();

      if (creatorError) {
        toast({
          title: "Error",
          description: "Failed to fetch creator profile",
          variant: "destructive",
        });
        return;
      }

      if (!creatorData) {
        toast({
          title: "Error",
          description: "Could not find your creator profile. Please complete your profile first.",
          variant: "destructive",
        });
        return;
      }

      // Check if application already exists
      const { data: existingApplication, error: applicationError } = await supabase
        .from('applications')
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('creator_id', creatorData.id)
        .maybeSingle();

      if (applicationError) {
        toast({
          title: "Error",
          description: "Failed to check existing applications",
          variant: "destructive",
        });
        return;
      }

      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this opportunity",
          variant: "destructive",
        });
        return;
      }

      // Submit the application
      const { error: submitError } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creatorData.id,
          cover_letter: coverLetter,
          status: 'pending'
        });

      if (submitError) {
        throw submitError;
      }

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });
      
      onClose();
      navigate("/creator/projects");
      
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

  return {
    isSubmitting,
    submitApplication,
  };
};