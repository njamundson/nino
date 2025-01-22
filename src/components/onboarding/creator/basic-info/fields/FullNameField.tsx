import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FullNameFieldProps {
  firstName: string;
  lastName: string;
  onUpdateField: (field: string, value: string) => void;
}

const FullNameField = ({ firstName, lastName, onUpdateField }: FullNameFieldProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    // Simply store the full name as firstName, we don't need to split it
    onUpdateField('firstName', fullName);
    onUpdateField('lastName', ''); // Keep lastName empty since we're using firstName for full name
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fullName" className="text-base flex items-center gap-1">
        Full Name or Creator Name
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="fullName"
        value={firstName} // Just use firstName since it contains the full name
        onChange={handleNameChange}
        placeholder="Enter your full name or creator name"
        className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
        required
      />
    </div>
  );
};

export default FullNameField;