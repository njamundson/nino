import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
        className="relative cursor-pointer"
      >
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={profileImage || ''} 
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200">
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