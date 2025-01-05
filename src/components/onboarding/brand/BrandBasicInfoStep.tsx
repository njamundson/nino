import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandBasicInfoStepProps {
  profileImage: string | null;
  brandData: {
    brandName: string;
    brandEmail: string;
    [key: string]: string;
  };
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
}

const BrandBasicInfoStep = ({
  profileImage,
  brandData,
  onUpdateField,
  onUpdateImage,
}: BrandBasicInfoStepProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Basic Information</h1>
        <p className="text-nino-gray text-sm">Let's start with the essentials</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <Avatar className="w-32 h-32 ring-4 ring-nino-bg transition-all duration-200 group-hover:ring-nino-primary/20">
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
            />
          </div>
          <p className="text-sm text-nino-gray">Upload your brand logo</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-base">Brand Name</Label>
            <Input
              id="brandName"
              placeholder="Enter your brand name"
              value={brandData.brandName}
              className="h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("brandName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandEmail" className="text-base">Brand Email</Label>
            <Input
              id="brandEmail"
              type="email"
              placeholder="Enter brand email"
              value={brandData.brandEmail}
              className="h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("brandEmail", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBasicInfoStep;