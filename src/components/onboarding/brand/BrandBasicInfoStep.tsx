import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { BrandData } from "@/types/brand";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BrandBasicInfoStepProps {
  profileImage: string | null;
  brandData: BrandData;
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
}

const BrandBasicInfoStep = ({
  profileImage,
  brandData,
  onUpdateField,
  onUpdateImage,
}: BrandBasicInfoStepProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Set a mock email for development
    onUpdateField("support_email", "test@example.com");
  }, [onUpdateField]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a local URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      onUpdateImage(imageUrl);
      
      toast({
        title: "Success",
        description: "Brand logo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
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
            <label
              htmlFor="photo-upload"
              className="cursor-pointer block"
            >
              <Avatar className="w-32 h-32 ring-4 ring-nino-bg transition-all duration-200 group-hover:ring-nino-primary/20">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-nino-bg">
                  <Camera className="w-12 h-12 text-nino-gray" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-3 bg-nino-primary rounded-full hover:bg-nino-primary/90 transition-colors shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
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
            <Label htmlFor="company_name" className="text-base">Brand Name</Label>
            <Input
              id="company_name"
              placeholder="Enter your brand name"
              value={brandData.company_name}
              className="h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("company_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_type" className="text-base">Brand Type</Label>
            <Select
              value={brandData.brand_type}
              onValueChange={(value) => onUpdateField("brand_type", value)}
            >
              <SelectTrigger id="brand_type" className="h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary">
                <SelectValue placeholder="Select your brand type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="health_wellness">Health & Wellness</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBasicInfoStep;