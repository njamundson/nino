import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

const SignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: undefined,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
      
      // Show success toast
      toast({
        title: "Account created successfully!",
        description: "Redirecting to onboarding...",
      });

      // Route based on user type
      const route = data.userType === 'brand' ? '/onboarding/brand' : '/onboarding/creator';
      navigate(route);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <NameFields form={form} disabled={form.formState.isSubmitting} />
      <EmailField form={form} disabled={form.formState.isSubmitting} />
      <PasswordFields form={form} disabled={form.formState.isSubmitting} />
      <SubmitButton loading={form.formState.isSubmitting} />
    </form>
  );
};

export default SignUpForm;