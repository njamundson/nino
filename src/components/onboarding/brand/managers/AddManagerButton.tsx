import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddManagerButtonProps {
  onClick: () => void;
}

const AddManagerButton = ({ onClick }: AddManagerButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="border-2 border-nino-primary text-nino-primary hover:bg-nino-primary hover:text-white"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Team Member
    </Button>
  );
};

export default AddManagerButton;