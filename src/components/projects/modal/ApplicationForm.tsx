import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import ApplicationFormHeader from "./ApplicationFormHeader";
import { useQueryClient } from "@tanstack/react-query";

const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(500, "Cover letter must not exceed 500 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
  };
  onBack: () => void;
  onClose: () => void;
  onModalClose: () => void;
}

const ApplicationForm = ({ opportunity, onBack, onClose, onModalClose }: ApplicationFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      console.log('Starting application submission...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please sign in to submit an application.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetching creator profile...');
      const { data: creator, error: creatorError } = await supabase
        .from("creators")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (creatorError || !creator) {
        console.error('Error fetching creator:', creatorError);
        toast({
          title: "Error",
          description: "Could not find your creator profile. Please ensure you've completed onboarding.",
          variant: "destructive",
        });
        return;
      }

      // Check for existing application
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("*")
        .eq("opportunity_id", opportunity.id)
        .eq("creator_id", creator.id)
        .maybeSingle();

      // If there's an existing application that was initiated by the creator, show error
      if (existingApplication && existingApplication.initiated_by === 'creator') {
        toast({
          title: "Already Applied",
          description: "You have already submitted an application for this opportunity.",
          variant: "destructive",
        });
        return;
      }

      // If there's an existing application initiated by the brand, update it
      if (existingApplication && existingApplication.initiated_by === 'brand') {
        const { error: updateError } = await supabase
          .from("applications")
          .update({
            cover_letter: data.coverLetter,
            status: 'pending'
          })
          .eq('id', existingApplication.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new application
        const { error: applicationError } = await supabase
          .from("applications")
          .insert({
            opportunity_id: opportunity.id,
            creator_id: creator.id,
            cover_letter: data.coverLetter,
            initiated_by: 'creator',
            status: 'pending'
          });

        if (applicationError) {
          throw applicationError;
        }
      }

      console.log('Application submitted successfully');
      
      // Show success message
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      // Refresh the applications data
      await queryClient.invalidateQueries({ queryKey: ['applications'] });

      // Close the modal
      onModalClose();
    } catch (error) {
      console.error("Error in application submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <ApplicationFormHeader
        title="Apply Now"
        subtitle="Share why you're perfect for this opportunity"
      />

      <div className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Letter
              </label>
              <Textarea
                {...form.register("coverLetter")}
                id="coverLetter"
                placeholder="Tell us why you're interested in this opportunity..."
                className="min-h-[200px] rounded-2xl bg-gray-50 border-gray-200 focus:border-nino-primary focus:ring-nino-primary"
              />
              {form.formState.errors.coverLetter && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.coverLetter.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="px-8 py-2.5 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-full transition-colors"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;