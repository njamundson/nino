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
      
      // For local development, we'll create a local URL
      const localUrl = URL.createObjectURL(file);
      onUpdateImage(localUrl);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });

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
        className="relative group cursor-pointer"
      >
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/50 transition-all duration-200 group-hover:ring-nino-primary/20">
          {profileImage ? (
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={profileImage} 
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="bg-nino-bg w-full h-full">
                <Plus className="w-8 h-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        
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
        {loading ? "Uploading..." : "Click to upload your profile photo"}
      </p>
    </div>
  );
};

export default ProfileImageUpload;