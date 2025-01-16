import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  password: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PasswordField = ({ password, onChange, placeholder = "Password" }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={password}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] pr-12 transition-all duration-300"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-nino-gray hover:text-nino-primary transition-colors duration-300"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordField;