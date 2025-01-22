import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandData } from "@/types/brand";

export const useBrandOnboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social' | 'managers'>('basic');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    user_id: '', // This will be set when user is authenticated
    company_name: '',
    brand_type: '',
    description: '',
    website: null,
    instagram: null,
    location: '',
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false
  });

  const updateField = (field: string, value: any) => {
    setBrandData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 'basic') {
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
      const { data: existingBrand, error: fetchError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If brand exists, update it. Otherwise, insert new brand
      const { error } = existingBrand 
        ? await supabase
            .from('brands')
            .update({
              ...brandData,
              user_id: user.id,
              profile_image_url: profileImage
            })
            .eq('id', existingBrand.id)
        : await supabase
            .from('brands')
            .insert({
              ...brandData,
              user_id: user.id,
              profile_image_url: profileImage
            });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand profile saved successfully!",
      });
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