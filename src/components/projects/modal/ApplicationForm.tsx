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
import { useState } from "react";
import SuccessModal from "./SuccessModal";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: creator } = await supabase
        .from("creators")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!creator) throw new Error("Creator profile not found");

      const { error } = await supabase.from("applications").insert({
        opportunity_id: opportunity.id,
        creator_id: creator.id,
        cover_letter: data.coverLetter,
        initiated_by: 'creator',
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      // Close the form and refresh the data
      onModalClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showSuccess) {
    return (
      <SuccessModal
        opportunityTitle={opportunity.title}
        onClose={onModalClose}
      />
    );
  }

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