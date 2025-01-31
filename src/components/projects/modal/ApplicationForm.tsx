import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ApplicationFormHeader from "./ApplicationFormHeader";
import { useQueryClient } from "@tanstack/react-query";
import ApplicationFormFields from "./form/ApplicationFormFields";
import ApplicationFormActions from "./form/ApplicationFormActions";

const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(500, "Cover letter must not exceed 500 characters"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  opportunity: {
    id: string;
    title: string;
  };
  onBack: () => void;
  onClose: () => void;
  onModalClose: () => void;
  isInvitation?: boolean;
}

const ApplicationForm = ({ 
  opportunity, 
  onBack, 
  onClose, 
  onModalClose,
  isInvitation = false 
}: ApplicationFormProps) => {
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
        .maybeSingle();

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
            initiated_by: isInvitation ? 'brand' : 'creator',
            status: 'pending'
          });

        if (applicationError) {
          throw applicationError;
        }
      }

      console.log('Application submitted successfully');
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      // Immediately invalidate both queries to trigger a refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      ]);

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
        title={isInvitation ? "Submit Your Application" : "Apply Now"}
        subtitle="Share why you're perfect for this opportunity"
      />

      <div className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ApplicationFormFields form={form} />
            <ApplicationFormActions 
              onBack={onBack}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;