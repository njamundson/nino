import { useState } from 'react';
import { CreatorData, CreatorType } from '@/types/creator';

export const useCreatorOnboarding = () => {
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: '',
    user_id: '',
    bio: '',
    location: '',
    specialties: [],
    instagram: '',
    website: '',
    profile_image_url: '',
    creator_type: 'solo',
    profile: {
      first_name: '',
      last_name: ''
    },
  });

  const handleUpdateField = (field: keyof CreatorData, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Handle form submission
    console.log('Form submitted:', creatorData);
  };

  return {
    creatorData,
    handleUpdateField,
    handleSubmit,
  };
};