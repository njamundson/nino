import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SkillsSelection from "@/components/onboarding/creator/professional-info/SkillsSelection";
import { useCreatorSettings } from "@/hooks/useCreatorSettings";

const Settings = () => {
  const {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  } = useCreatorSettings();

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

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

  return (
    <div className="bg-white min-h-screen p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <h1 className="text-2xl font-semibold text-nino-text mb-6">Settings</h1>
      <div className="max-w-3xl">
        <div className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-white/50 transition-all duration-200 group-hover:ring-nino-primary/20">
                    <AvatarImage 
                      src={profileImage || ""} 
                      className="object-cover"
                    />
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

              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-nino-text">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={creatorData.firstName}
                      onChange={(e) => handleUpdateField("firstName", e.target.value)}
                      disabled={loading}
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={creatorData.lastName}
                      onChange={(e) => handleUpdateField("lastName", e.target.value)}
                      disabled={loading}
                      className="bg-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={creatorData.location}
                    onChange={(e) => handleUpdateField("location", e.target.value)}
                    disabled={loading}
                    placeholder="Where are you based?"
                    className="bg-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={creatorData.bio}
                    onChange={(e) => handleUpdateField("bio", e.target.value)}
                    disabled={loading}
                    placeholder="Tell us about yourself..."
                    className="bg-white/50 resize-none min-h-[120px]"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-nino-text">Professional Information</h2>
                <div className="space-y-2">
                  <Label>Skills & Specialties</Label>
                  <SkillsSelection
                    skills={creatorData.specialties}
                    onUpdateSkills={(skills) => handleUpdateField("specialties", skills)}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-nino-text">Social & Contact</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      value={creatorData.instagram}
                      onChange={(e) => handleUpdateField("instagram", e.target.value)}
                      disabled={loading}
                      placeholder="@yourusername"
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={creatorData.website}
                      onChange={(e) => handleUpdateField("website", e.target.value)}
                      disabled={loading}
                      placeholder="https://yourwebsite.com"
                      className="bg-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-nino-primary hover:bg-nino-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;