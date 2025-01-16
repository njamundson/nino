import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isEditing: boolean;
  loading: boolean;
  onEditToggle: () => void;
}

const ProfileHeader = ({ isEditing, loading, onEditToggle }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-semibold text-nino-text">Profile Information</h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEditToggle}
        disabled={loading}
        className="text-nino-primary"
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </div>
  );
};

export default ProfileHeader;