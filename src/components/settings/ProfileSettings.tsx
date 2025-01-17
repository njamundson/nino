import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState({
    email: "",
    location: "",
    company_name: "",
  });
  const [managers, setManagers] = useState<Manager[]>([]);
  const [showAddManager, setShowAddManager] = useState(false);

  useEffect(() => {
    fetchBrandData();
    fetchManagers();
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
          email: user.email || "",
          location: brand.location || "",
          company_name: brand.company_name || "",
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
          location: brandData.location,
          company_name: brandData.company_name,
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

  const handleAddManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) return;

      const formData = new FormData(e.currentTarget);
      const newManager = {
        brand_id: brand.id,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as string,
      };

      const { data, error } = await supabase
        .from('brand_managers')
        .insert([newManager])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setManagers([...managers, data]);
        setShowAddManager(false);
        toast({
          title: "Success",
          description: "Manager added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      toast({
        title: "Error",
        description: "Failed to add manager",
        variant: "destructive",
      });
    }
  };

  const handleRemoveManager = async (managerId: string) => {
    try {
      const { error } = await supabase
        .from('brand_managers')
        .delete()
        .eq('id', managerId);

      if (error) throw error;

      setManagers(managers.filter(m => m.id !== managerId));
      toast({
        title: "Success",
        description: "Manager removed successfully",
      });
    } catch (error) {
      console.error('Error removing manager:', error);
      toast({
        title: "Error",
        description: "Failed to remove manager",
        variant: "destructive",
      });
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={brandData.email}
              onChange={(e) => setBrandData({ ...brandData, email: e.target.value })}
              disabled={loading}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={brandData.company_name}
              onChange={(e) => setBrandData({ ...brandData, company_name: e.target.value })}
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

        {/* Account Managers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium">Account Managers</Label>
            <Button
              onClick={() => setShowAddManager(true)}
              disabled={loading}
              variant="outline"
              className="bg-white/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manager
            </Button>
          </div>

          <AnimatePresence>
            {showAddManager && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 p-4 bg-white/50 rounded-lg border"
                onSubmit={handleAddManager}
              >
                <Input
                  name="name"
                  placeholder="Name"
                  required
                  className="bg-white"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-white"
                />
                <Input
                  name="role"
                  placeholder="Role (e.g., Admin, Editor)"
                  required
                  className="bg-white"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddManager(false)}
                    className="bg-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Add Manager
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {managers.map((manager) => (
              <motion.div
                key={manager.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/60 transition-colors"
              >
                <div>
                  <p className="font-medium">{manager.name}</p>
                  <p className="text-sm text-nino-gray">{manager.email}</p>
                  <p className="text-xs text-nino-primary">{manager.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveManager(manager.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
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