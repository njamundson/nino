import { useState } from "react";
import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import { Button } from "@/components/ui/button";
import { Loader2, UserRound, Camera, Mail, MapPin, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const CreatorSettings = () => {
  const {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  } = useCreatorSettings();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8">Creator Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <UserRound className="w-5 h-5 text-nino-primary" />
            <h2 className="text-lg font-medium">Creator Profile</h2>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback>
                  <Camera className="w-8 h-8 text-nino-gray" />
                </AvatarFallback>
              </Avatar>
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={creatorData.display_name}
                onChange={(e) => setCreatorData({ ...creatorData, display_name: e.target.value })}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={creatorData.bio}
                onChange={(e) => setCreatorData({ ...creatorData, bio: e.target.value })}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary resize-none h-32"
              />
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-nino-primary" />
            <h2 className="text-lg font-medium">Contact Information</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={creatorData.location}
                onChange={(e) => setCreatorData({ ...creatorData, location: e.target.value })}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
              />
            </div>
          </div>
        </Card>

        {/* Social Links Section */}
        <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <Link className="w-5 h-5 text-nino-primary" />
            <h2 className="text-lg font-medium">Social Links</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={creatorData.instagram}
                onChange={(e) => setCreatorData({ ...creatorData, instagram: e.target.value })}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={creatorData.website}
                onChange={(e) => setCreatorData({ ...creatorData, website: e.target.value })}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-nino-primary" />
            <h2 className="text-lg font-medium">Notification Settings</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via email</p>
            </div>
            <Switch
              checked={creatorData.notifications_enabled}
              onCheckedChange={(checked) => setCreatorData({ ...creatorData, notifications_enabled: checked })}
            />
          </div>
        </Card>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 text-base font-medium transition-all duration-200 hover:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};