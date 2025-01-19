import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface ProfileImageSectionProps {
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
}

const ProfileImageSection = ({ profileImage, setProfileImage }: ProfileImageSectionProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user found');

        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update the creator's profile_image_url
        const { error: updateError } = await supabase
          .from('creators')
          .update({ profile_image_url: publicUrl })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        setProfileImage(publicUrl);
        
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 ring-4 ring-white/50 transition-all duration-200 group-hover:ring-nino-primary/20">
          <AvatarImage src={profileImage || ""} />
          <AvatarFallback className="bg-nino-bg">
            <Camera className="w-12 h-12 text-nino-gray" />
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor="photo-upload"
          className="absolute bottom-0 right-0 p-3 bg-nino-primary rounded-full cursor-pointer hover:bg-nino-primary/90 transition-colors shadow-lg"
        >
          <Camera className="w-5 h-5 text-white" />
        </label>
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
      </div>
      <p className="text-sm text-nino-gray">
        {loading ? "Uploading..." : "Upload your profile photo"}
      </p>
    </div>
  );
};

export default ProfileImageSection;