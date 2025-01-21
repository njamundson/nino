import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FullNameFieldProps {
  firstName: string;
  lastName: string;
  onUpdateField: (field: string, value: string) => void;
}

const FullNameField = ({ firstName, lastName, onUpdateField }: FullNameFieldProps) => {
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    const names = fullName.trim().split(/\s+/);
    
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      onUpdateField('firstName', firstName);
      onUpdateField('lastName', lastName);
    } else {
      onUpdateField('firstName', fullName);
      onUpdateField('lastName', '');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fullName" className="text-base flex items-center gap-1">
        Full Name or Creator Name
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="fullName"
        value={`${firstName}${lastName ? ' ' + lastName : ''}`}
        onChange={handleFullNameChange}
        placeholder="Enter your full name"
        className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
        required
      />
    </div>
  );
};

export default FullNameField;