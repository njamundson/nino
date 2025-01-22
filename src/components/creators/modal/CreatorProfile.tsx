import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";

interface Creator {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  specialties?: string[];
  instagram?: string;
  website?: string;
  location?: string;
  profileImage?: string;
  creatorType?: string;
  profile?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface CreatorProfileProps {
  creator: Creator;
  onClose: () => void;
  onMessageClick?: () => void;
}

const CreatorProfile = ({ creator, onClose }: CreatorProfileProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessageClick = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to message creators",
          variant: "destructive",
        });
        return;
      }

      // Get creator's user_id from creators table
      const { data: creatorData } = await supabase
        .from('creators')
        .select('user_id')
        .eq('id', creator.id)
        .single();

      if (!creatorData?.user_id) {
        toast({
          title: "Error",
          description: "Unable to start conversation with this creator",
          variant: "destructive",
        });
        return;
      }

      // Navigate to messages with the creator's user_id as a parameter
      navigate(`/brand/messages?user=${creatorData.user_id}`);
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        <CreatorImage 
          profileImage={creator.profileImage}
          firstName={creator.firstName}
          lastName={creator.lastName}
          profile={creator.profile}
        />

        <CreatorBio 
          bio={creator.bio}
          specialties={creator.specialties}
          location={creator.location}
          creatorType={creator.creatorType}
          instagram={creator.instagram}
          website={creator.website}
          onMessageClick={handleMessageClick}
        />

        <div className="mt-auto">
          <Button
            size="lg"
            onClick={handleMessageClick}
            className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            Message Creator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;