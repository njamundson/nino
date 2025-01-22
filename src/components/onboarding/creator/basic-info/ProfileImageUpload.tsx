import { Plus, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileImageUploadProps {
  profileImage: string | null;
  onUpdateImage: (url: string) => void;
}

const ProfileImageUpload = ({ profileImage, onUpdateImage }: ProfileImageUploadProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      onUpdateImage(publicUrl);
      
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
      <div className="relative">
        <label
          htmlFor="photo-upload"
          className="cursor-pointer block"
        >
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#F9F6F2]">
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={profileImage || ''} 
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="w-full h-full bg-[#F9F6F2] flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Plus icon circle */}
          <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#A55549] flex items-center justify-center shadow-md">
            <Plus className="w-6 h-6 text-white" />
          </div>
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
        {loading ? "Uploading..." : "Click to upload your profile photo"}
      </p>
    </div>
  );
};

export default ProfileImageUpload;