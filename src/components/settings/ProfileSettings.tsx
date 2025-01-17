import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import ProfileImageSection from "./profile/ProfileImageSection";
import BrandDetailsForm from "./profile/BrandDetailsForm";
import ContactInformationForm from "./profile/ContactInformationForm";
import AccountManagersSection from "./profile/AccountManagersSection";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState({
    company_name: "",
    description: "",
    website: "",
    instagram: "",
    location: "",
    phone_number: "",
    support_email: "",
    email: "",
    profile_image_url: "",
  });

  useEffect(() => {
    fetchBrandData();
  }, []);

  const fetchBrandData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

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
          email: user.email || "",
          profile_image_url: brand.profile_image_url || "",
        });
        setProfileImage(brand.profile_image_url);
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

  const handleUpdateField = (field: string, value: any) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
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
          profile_image_url: profileImage,
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
        <ProfileImageSection 
          profileImage={profileImage} 
          setProfileImage={setProfileImage}
        />

        <BrandDetailsForm 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <ContactInformationForm 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <AccountManagersSection />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;