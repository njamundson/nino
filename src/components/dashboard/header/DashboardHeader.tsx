import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import NotificationBell from "./NotificationBell";
import { useProfile } from "@/hooks/useProfile";

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();

  return (
    <div className="flex justify-end items-center space-x-4 mb-8">
      <NotificationBell isOpen={isOpen} setIsOpen={setIsOpen} />
      <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
        <AvatarImage src={profile?.avatarUrl || ""} alt="Profile" />
        <AvatarFallback className="bg-nino-primary text-nino-white">
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default DashboardHeader;