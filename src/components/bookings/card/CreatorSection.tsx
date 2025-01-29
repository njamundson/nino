import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface CreatorSectionProps {
  creator: any;
  onViewCreator: () => void;
}

const CreatorSection = ({ creator, onViewCreator }: CreatorSectionProps) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        {creator.profile_image_url ? (
          <img
            src={creator.profile_image_url}
            alt={`${creator.first_name} ${creator.last_name}`}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        )}
        <div>
          <p className="font-medium">
            {creator.first_name} {creator.last_name}
          </p>
          <p className="text-sm text-gray-500">{creator.location}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewCreator}
        className="hover:bg-gray-100"
      >
        View Profile
      </Button>
    </div>
  );
};

export default CreatorSection;