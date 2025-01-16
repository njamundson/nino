import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
}

const ProfileAvatar = ({ firstName, lastName }: ProfileAvatarProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="w-20 h-20">
        <AvatarFallback>
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;