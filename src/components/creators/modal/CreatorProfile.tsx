import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CreatorImage from "./profile/CreatorImage";
import CreatorBio from "./profile/CreatorBio";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import { Creator } from "@/types/creator";

interface CreatorProfileProps {
  creator: Creator;
  onClose: () => void;
}

const CreatorProfile = ({ creator, onClose }: CreatorProfileProps) => {
  const navigate = useNavigate();

  const handleMessageClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to message creators");
        return;
      }

      // Get the creator's user_id from the creators table
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('user_id')
        .eq('id', creator.id)
        .single();

      if (creatorError || !creatorData) {
        throw new Error('Could not find creator');
      }

      // Navigate to messages with the creator's user_id as a parameter
      navigate(`/brand/messages?user=${creatorData.user_id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error("Could not start chat. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <CreatorImage 
        profileImage={creator.profileImage}
        profile={creator.profile}
      />
      
      <div className="flex flex-col h-full space-y-6">
        <CreatorBio 
          bio={creator.bio}
          location={creator.location}
          specialties={creator.specialties}
          instagram={creator.instagram}
          website={creator.website}
          onMessageClick={handleMessageClick}
        />

        <CreatorSocialLinks 
          instagram={creator.instagram}
          website={creator.website}
        />
      </div>
    </div>
  );
};

export default CreatorProfile;