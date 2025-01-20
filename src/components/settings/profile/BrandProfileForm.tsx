import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BrandProfileFormProps {
  loading: boolean;
  profileImage: string | null;
  brandData: {
    company_name: string;
    description: string;
    website: string;
    instagram: string;
    location: string;
  };
  onUpdateField: (field: string, value: any) => void;
  onUpdateImage: (url: string) => void;
}

const BrandProfileForm = ({
  loading,
  profileImage,
  brandData,
  onUpdateField,
  onUpdateImage,
}: BrandProfileFormProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
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

      onUpdateImage(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Brand Profile</h3>
        <p className="text-sm text-gray-500">
          Update your brand information and online presence
        </p>
      </div>

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
          {loading ? "Uploading..." : "Upload your brand logo"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Brand Name</Label>
          <Input
            id="company_name"
            value={brandData.company_name}
            onChange={(e) => onUpdateField("company_name", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={brandData.location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="Where is your brand based?"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Bio</Label>
          <Textarea
            id="description"
            value={brandData.description}
            onChange={(e) => onUpdateField("description", e.target.value)}
            disabled={loading}
            className="bg-white/50 min-h-[100px]"
            placeholder="Tell us about your brand..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram Username</Label>
          <Input
            id="instagram"
            value={brandData.instagram}
            onChange={(e) => onUpdateField("instagram", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="@username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={brandData.website}
            onChange={(e) => onUpdateField("website", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="https://"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandProfileForm;