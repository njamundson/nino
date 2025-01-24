import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, UserRound, Bell, Shield, Mail, Building2, MapPin, Link, Phone } from "lucide-react";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ProfileImageSection from "@/components/settings/profile/ProfileImageSection";
import { useToast } from "@/hooks/use-toast";

const BrandSettings = () => {
  const {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    handleUpdateField,
    handleSave,
  } = useBrandSettings();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const onSave = async () => {
    const formData = new FormData();
    Object.entries(brandData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    await handleSave(formData);
    setIsEditing(false);
  };

  const handleManageSubscription = () => {
    toast({
      title: "Coming Soon",
      description: "Subscription management will be available soon.",
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nino-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-nino-text">Settings</h1>
            <p className="text-sm text-nino-gray">Manage your brand settings and preferences</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            {isEditing ? 'Cancel' : 'Edit Settings'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brand Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <UserRound className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Brand Profile</h2>
            </div>
            <ProfileImageSection
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  value={brandData.company_name}
                  onChange={(e) => handleUpdateField("company_name", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand Type</Label>
                <Input
                  value={brandData.brand_type}
                  onChange={(e) => handleUpdateField("brand_type", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={brandData.description}
                onChange={(e) => handleUpdateField("description", e.target.value)}
                disabled={!isEditing}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary resize-none h-32"
              />
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input
                  value={brandData.support_email || ''}
                  onChange={(e) => handleUpdateField("support_email", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={brandData.phone_number || ''}
                  onChange={(e) => handleUpdateField("phone_number", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Location</h2>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={brandData.location || ''}
                onChange={(e) => handleUpdateField("location", e.target.value)}
                disabled={!isEditing}
                className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
              />
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <Link className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Social Links</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={brandData.website || ''}
                  onChange={(e) => handleUpdateField("website", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={brandData.instagram || ''}
                  onChange={(e) => handleUpdateField("instagram", e.target.value)}
                  disabled={!isEditing}
                  className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch
                  checked={brandData.sms_notifications_enabled}
                  onCheckedChange={(checked) => handleUpdateField("sms_notifications_enabled", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={brandData.email_notifications_enabled}
                  onCheckedChange={(checked) => handleUpdateField("email_notifications_enabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-nino-primary" />
              <h2 className="text-lg font-medium">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch
                  checked={brandData.two_factor_enabled}
                  onCheckedChange={(checked) => handleUpdateField("two_factor_enabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-4"
          >
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrandSettings;