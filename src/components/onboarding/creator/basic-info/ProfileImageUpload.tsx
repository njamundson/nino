import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileImageUploadProps {
  profileImage: string | null;
  onUpdateImage: (url: string) => void;
}

const ProfileImageUpload = ({ profileImage, onUpdateImage }: ProfileImageUploadProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload a profile photo",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: creatorError } = await supabase
        .from('creators')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', session.user.id);

      if (creatorError) {
        throw creatorError;
      }

      onUpdateImage(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });

      const timestamp = new Date().getTime();
      const refreshedUrl = `${publicUrl}?t=${timestamp}`;
      onUpdateImage(refreshedUrl);

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label
        htmlFor="photo-upload"
        className="relative group cursor-pointer w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-300"
      >
        {profileImage ? (
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={profileImage} 
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-nino-bg w-full h-full" />
          </Avatar>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Add photo</span>
          </div>
        )}
        
        {profileImage && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center transform translate-y-20 group-hover:translate-y-0 transition-transform duration-200">
              <Plus className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        )}
        
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
      </label>
      <p className="text-sm text-nino-gray">
        {loading ? "Uploading..." : "Click anywhere to upload your profile photo"}
      </p>
    </div>
  );
};

export default ProfileImageUpload;