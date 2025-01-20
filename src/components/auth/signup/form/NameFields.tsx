import { Input } from "@/components/ui/input";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onChange: (field: 'firstName' | 'lastName', value: string) => void;
  disabled?: boolean;
}

const NameFields = ({ firstName, lastName, onChange, disabled }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
        className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
        required
        disabled={disabled}
      />
      <Input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
        className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
        required
        disabled={disabled}
      />
    </div>
  );
};

export default NameFields;