import { Input } from "@/components/ui/input";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

const NameFields = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
        required
      />
      <Input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
        className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
        required
      />
    </div>
  );
};

export default NameFields;