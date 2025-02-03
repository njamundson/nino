import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatHeaderProps {
  userId: string;
  onBack?: () => void;
}

interface ProfileData {
  id: string;
  display_name: string;
  profile_image_url?: string | null;
}

const ChatHeader = ({ userId, onBack }: ChatHeaderProps) => {
  const { data: profile } = useQuery({
    queryKey: ['chat-profile', userId],
    queryFn: async () => {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return {
          id: userId,
          display_name: 'Unknown User',
        };
      }

      return profileData as ProfileData;
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <Avatar className="h-8 w-8">
        <AvatarImage src={profile?.profile_image_url || ''} />
        <AvatarFallback>
          {profile?.display_name ? getInitials(profile.display_name) : 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">
        {profile?.display_name || 'Loading...'}
      </span>
    </div>
  );
};

export default ChatHeader;