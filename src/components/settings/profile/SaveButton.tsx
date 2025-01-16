import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveButtonProps {
  loading: boolean;
  onSave: () => void;
}

const SaveButton = ({ loading, onSave }: SaveButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave}
        disabled={loading}
        className="bg-nino-primary hover:bg-nino-primary/90"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
};

export default SaveButton;