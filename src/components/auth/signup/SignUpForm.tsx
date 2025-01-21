import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import NameFields from "./form/NameFields";
import EmailField from "./form/EmailField";
import PasswordFields from "./form/PasswordFields";
import SubmitButton from "./form/SubmitButton";
import UserTypeSelect from "./form/UserTypeSelect";

const signUpSchema = z.object({
  userType: z.enum(["brand", "creator"], {
    required_error: "Please select your account type",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  loading: boolean;
}

const SignUpForm = ({ onSubmit, loading }: SignUpFormProps) => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: undefined,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UserTypeSelect form={form} disabled={loading} />
        <NameFields form={form} disabled={loading} />
        <EmailField form={form} disabled={loading} />
        <PasswordFields form={form} disabled={loading} />
        <SubmitButton loading={loading} />
      </form>
    </Form>
  );
};

export default SignUpForm;