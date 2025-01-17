import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Plus, X, Shield, History, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showAddManager, setShowAddManager] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [brandData, setBrandData] = useState({
    company_name: "",
    description: "",
    website: "",
    instagram: "",
    location: "",
    phone_number: "",
    support_email: "",
    sms_notifications_enabled: false,
    two_factor_enabled: false,
    email: "",
  });

  useEffect(() => {
    fetchBrandData();
    fetchManagers();
    fetchLoginHistory();
  }, []);

  const fetchBrandData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (brand) {
        setBrandData({
          company_name: brand.company_name || "",
          description: brand.description || "",
          website: brand.website || "",
          instagram: brand.instagram || "",
          location: brand.location || "",
          phone_number: brand.phone_number || "",
          support_email: brand.support_email || "",
          sms_notifications_enabled: brand.sms_notifications_enabled || false,
          two_factor_enabled: brand.two_factor_enabled || false,
          email: user.email || "",
        });
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
      toast({
        title: "Error",
        description: "Failed to load brand data",
        variant: "destructive",
      });
    }
  };

  const fetchManagers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brand) {
        const { data: managersData, error } = await supabase
          .from('brand_managers')
          .select('*')
          .eq('brand_id', brand.id);

        if (error) throw error;
        if (managersData) {
          setManagers(managersData);
        }
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast({
        title: "Error",
        description: "Failed to load account managers",
        variant: "destructive",
      });
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brand) {
        const { data: historyData, error } = await supabase
          .from('brand_login_history')
          .select('*')
          .eq('brand_id', brand.id)
          .order('login_timestamp', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (historyData) {
          setLoginHistory(historyData);
        }
      }
    } catch (error) {
      console.error('Error fetching login history:', error);
      toast({
        title: "Error",
        description: "Failed to load login history",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setProfileImage(publicUrl);
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('brands')
        .update({
          company_name: brandData.company_name,
          description: brandData.description,
          website: brandData.website,
          instagram: brandData.instagram,
          location: brandData.location,
          phone_number: brandData.phone_number,
          support_email: brandData.support_email,
          sms_notifications_enabled: brandData.sms_notifications_enabled,
          two_factor_enabled: brandData.two_factor_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      toast({
        title: "Error",
        description: "Failed to update brand profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border shadow-sm space-y-8">
      <div className="space-y-6">
        {/* Profile Image */}
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
          <p className="text-sm text-nino-gray">Upload your brand logo</p>
        </div>

        {/* Brand Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Brand Name</Label>
            <Input
              id="company_name"
              value={brandData.company_name}
              onChange={(e) => setBrandData({ ...brandData, company_name: e.target.value })}
              disabled={loading}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Brand Description</Label>
            <Textarea
              id="description"
              value={brandData.description}
              onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
              disabled={loading}
              className="bg-white/50 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={brandData.website}
                onChange={(e) => setBrandData({ ...brandData, website: e.target.value })}
                disabled={loading}
                className="bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={brandData.instagram}
                onChange={(e) => setBrandData({ ...brandData, instagram: e.target.value })}
                disabled={loading}
                className="bg-white/50"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={brandData.email}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Support Email</Label>
              <Input
                id="support_email"
                type="email"
                value={brandData.support_email}
                onChange={(e) => setBrandData({ ...brandData, support_email: e.target.value })}
                disabled={loading}
                className="bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={brandData.phone_number}
                onChange={(e) => setBrandData({ ...brandData, phone_number: e.target.value })}
                disabled={loading}
                className="bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={brandData.location}
                onChange={(e) => setBrandData({ ...brandData, location: e.target.value })}
                disabled={loading}
                className="bg-white/50"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-nino-gray">Receive notifications via text message</p>
              </div>
              <Switch
                checked={brandData.sms_notifications_enabled}
                onCheckedChange={(checked) => setBrandData({ ...brandData, sms_notifications_enabled: checked })}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-nino-gray">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={brandData.two_factor_enabled}
                onCheckedChange={(checked) => setBrandData({ ...brandData, two_factor_enabled: checked })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Login History */}
          <div className="mt-4 space-y-2">
            <Label>Recent Login Activity</Label>
            <div className="space-y-2">
              {loginHistory.map((login) => (
                <div key={login.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{new Date(login.login_timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-nino-gray">{login.ip_address}</p>
                  </div>
                  <div className="text-xs text-nino-gray">{login.device_info}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support and Help */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              View FAQ
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;