import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBrandSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState({
    brandName: "",
    brandEmail: "",
    brandBio: "",
    homeLocation: "",
    instagram: "",
    website: "",
    location: "",
    brandType: "hotel",
  });

  const fetchBrandData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (brand) {
        setBrandData({
          brandName: brand.brand_name || "",
          brandEmail: brand.brand_email || "",
          brandBio: brand.brand_bio || "",
          homeLocation: brand.home_location || "",
          instagram: brand.instagram || "",
          website: brand.website || "",
          location: brand.location || "",
          brandType: brand.brand_type || "hotel",
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('brands')
        .update({
          brand_name: brandData.brandName,
          brand_email: brandData.brandEmail,
          brand_bio: brandData.brandBio,
          home_location: brandData.homeLocation,
          instagram: brandData.instagram,
          website: brandData.website,
          location: brandData.location,
          brand_type: brandData.brandType,
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

  useEffect(() => {
    fetchBrandData();
  }, []);

  return {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    setBrandData,
    handleSave,
  };
};