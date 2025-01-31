import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormValues } from "../ApplicationForm";

interface ApplicationFormFieldsProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const ApplicationFormFields = ({ form }: ApplicationFormFieldsProps) => {
  return (
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
  );
};

export default ApplicationFormFields;