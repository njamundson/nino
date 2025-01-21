import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../SignUpForm";

interface NameFieldsProps {
  form: UseFormReturn<SignUpFormData>;
  disabled?: boolean;
}

const NameFields = ({ form, disabled }: NameFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="userType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User Type</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <SelectTrigger className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
                disabled={disabled}
                placeholder="Enter your first name"
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
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
                disabled={disabled}
                placeholder="Enter your last name"
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