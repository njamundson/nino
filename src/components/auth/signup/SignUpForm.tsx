import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import NameFields from "./form/NameFields";
import EmailField from "./form/EmailField";
import PasswordFields from "./form/PasswordFields";
import SubmitButton from "./form/SubmitButton";

const signUpSchema = z.object({
  userType: z.enum(["brand", "creator"], {
    required_error: "Please select a user type",
  }),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading?: boolean;
}

const SignUpForm = ({ onSubmit, loading = false }: SignUpFormProps) => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: undefined,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameFields form={form} disabled={loading} />
        <EmailField form={form} disabled={loading} />
        <PasswordFields form={form} disabled={loading} />
        <SubmitButton loading={loading} />
      </form>
    </Form>
  );
};

export default SignUpForm;