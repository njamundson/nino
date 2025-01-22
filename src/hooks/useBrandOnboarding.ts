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

      // Update the user_id in brandData before submitting
      setBrandData(prev => ({ ...prev, user_id: user.id }));

      const { error } = await supabase
        .from('brands')
        .insert({
          ...brandData,
          user_id: user.id,
          profile_image_url: profileImage
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand created successfully!",
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      toast({
        title: "Error",
        description: "Failed to create brand. Please try again.",
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