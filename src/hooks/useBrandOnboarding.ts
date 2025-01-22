import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandData } from "@/types/brand";
import { useNavigate } from "react-router-dom";

export const useBrandOnboarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social' | 'managers'>('basic');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    user_id: '',
    company_name: '',
    brand_type: '',
    description: null,
    website: null,
    instagram: null,
    location: '',
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false
  });

  const updateField = (field: keyof BrandData, value: any) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const validateBasicInfo = () => {
    // Check if company_name is filled (trimmed to handle whitespace-only input)
    const isCompanyNameValid = brandData.company_name.trim().length > 0;
    
    if (!isCompanyNameValid) {
      toast({
        title: "Required Field Missing",
        description: "Please enter your brand name.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 'basic') {
      if (!validateBasicInfo()) {
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('managers');
    }
  };

  const handleBack = () => {
    if (currentStep === 'managers') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('basic');
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Check if brand already exists for this user
      const { data: existingBrand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const brandPayload = {
        ...brandData,
        user_id: user.id,
        profile_image_url: profileImage
      };

      let error;
      if (existingBrand) {
        // Update existing brand
        ({ error } = await supabase
          .from('brands')
          .update(brandPayload)
          .eq('id', existingBrand.id));
      } else {
        // Insert new brand
        ({ error } = await supabase
          .from('brands')
          .insert(brandPayload));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand profile saved successfully!",
      });

      // Navigate to brand dashboard after successful onboarding
      navigate('/brand/dashboard', { replace: true });
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        title: "Error",
        description: "Failed to save brand profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    currentStep,
    setCurrentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
    onSubmit,
  };
};