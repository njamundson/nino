import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface BasicInfoStepProps {
  profileImage: string | null;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
}

const BasicInfoStep = ({
  profileImage,
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
  onUpdateImage,
}: BasicInfoStepProps) => {
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
        <h1 className="text-2xl font-medium text-nino-text">
          Complete your profile
        </h1>
        <p className="text-nino-gray text-sm">Tell us more about yourself</p>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="relative group cursor-pointer">
          <Avatar className="w-32 h-32 ring-4 ring-nino-bg transition-all duration-200 group-hover:ring-nino-primary/20">
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback className="bg-nino-bg">
              <Camera className="w-12 h-12 text-nino-gray" />
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 p-3 bg-nino-primary rounded-full cursor-pointer hover:bg-nino-primary/90 transition-colors"
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
        <p className="text-sm text-nino-gray">Upload your profile photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onUpdateField("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          placeholder="Enter your location"
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;