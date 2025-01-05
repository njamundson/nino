import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Instagram, Globe, X } from "lucide-react";

const CreatorOnboarding = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const creatorTypes = ["Solo", "Couple", "Family", "Group"];
  const skills = [
    "UGC Creator",
    "Videographer",
    "Photographer",
    "Model/Talent",
    "Public Relations/Writer",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-nino-primary rounded-full" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-nino-text">
            Complete your creator profile
          </h1>
          <p className="text-nino-gray">Tell us more about yourself</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm space-y-8">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="w-24 h-24 ring-4 ring-nino-bg transition-all duration-200 group-hover:ring-nino-primary/20">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-nino-bg">
                  <Camera className="w-8 h-8 text-nino-gray" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 p-2 bg-nino-primary rounded-full cursor-pointer hover:bg-nino-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
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

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name"
                className="bg-nino-bg border-transparent focus:border-nino-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name"
                className="bg-nino-bg border-transparent focus:border-nino-primary" 
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="h-24 bg-nino-bg border-transparent focus:border-nino-primary resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="relative">
              <Instagram className="absolute left-3 top-3 w-5 h-5 text-nino-gray" />
              <Input
                placeholder="Instagram username"
                className="pl-10 bg-nino-bg border-transparent focus:border-nino-primary"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-nino-gray" />
              <Input
                placeholder="Website URL"
                className="pl-10 bg-nino-bg border-transparent focus:border-nino-primary"
              />
            </div>
          </div>

          {/* Creator Type */}
          <div className="space-y-2">
            <Label>Creator Type</Label>
            <Select>
              <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary">
                <SelectValue placeholder="Select your creator type" />
              </SelectTrigger>
              <SelectContent>
                {creatorTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  onClick={() => toggleSkill(skill)}
                  className={`
                    transition-all duration-200
                    ${selectedSkills.includes(skill)
                      ? "bg-nino-primary text-white hover:bg-nino-primary/90"
                      : "bg-nino-bg border-transparent hover:border-nino-primary"
                    }
                  `}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <X className="w-4 h-4 ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            onClick={() => navigate("/onboarding")}
            variant="outline"
            className="text-nino-gray hover:bg-white"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            Complete Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorOnboarding;