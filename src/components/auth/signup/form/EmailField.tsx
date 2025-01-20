import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  email: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const EmailField = ({ email, onChange, disabled }: EmailFieldProps) => {
  return (
    <Input
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
      required
      disabled={disabled}
    />
  );
};

export default EmailField;