import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface NameFieldsProps {
  form: UseFormReturn<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>;
  disabled?: boolean;
}

const NameFields = ({ form, disabled }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="First Name"
                className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Last Name"
                className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameFields;