import { Camera } from "lucide-react";
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
      
      // Check authentication status
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

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onUpdateImage(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Handle specific error cases
      if (error.message?.includes('JWT')) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

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

export default ProfileImageUpload;