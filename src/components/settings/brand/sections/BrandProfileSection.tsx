import { UserRound, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BrandProfileSectionProps {
  profileImage: string | null;
  brandData: any;
  isEditing: boolean;
  handleUpdateField: (field: string, value: any) => void;
  setProfileImage: (image: string | null) => void;
}

const BrandProfileSection = ({
  profileImage,
  brandData,
  isEditing,
  handleUpdateField,
  setProfileImage,
}: BrandProfileSectionProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <UserRound className="w-5 h-5 text-nino-primary" />
        <h2 className="text-lg font-medium">Brand Profile</h2>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback>
              <Camera className="w-8 h-8 text-nino-gray" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 p-2 bg-nino-primary rounded-full hover:bg-nino-primary/90 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setProfileImage(url);
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Brand Name</Label>
          <Input
            value={brandData.company_name}
            onChange={(e) => handleUpdateField("company_name", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Description</Label>
          <Textarea
            value={brandData.description}
            onChange={(e) => handleUpdateField("description", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandProfileSection;