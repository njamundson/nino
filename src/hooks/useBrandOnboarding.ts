import { useState } from 'react';
import { BrandData, BrandType } from '@/types/brand';

export const useBrandOnboarding = () => {
  const [brandData, setBrandData] = useState<BrandData>({
    id: '',
    company_name: '',
    brand_type: 'retail',
    description: '',
    website: '',
    instagram: '',
    location: '',
    phone_number: '',
    support_email: '',
    profile_image_url: '',
    sms_notifications_enabled: false,
    two_factor_enabled: false
  });

  const handleUpdateField = (field: keyof BrandData, value: any) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Handle form submission
    console.log('Form submitted:', brandData);
  };

  return {
    brandData,
    handleUpdateField,
    handleSubmit,
  };
};