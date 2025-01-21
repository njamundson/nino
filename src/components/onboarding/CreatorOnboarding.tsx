import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CreatorOnboardingForm from "./creator/CreatorOnboardingForm";
import { CreatorData } from '@/types/creator';
import { supabase } from '@/integrations/supabase/client';

const CreatorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Update creator profile
      const { error: creatorError } = await supabase
        .from('creators')
        .update({
          bio: creatorData.bio,
          location: creatorData.location,
          specialties: creatorData.specialties,
          instagram: creatorData.instagram,
          website: creatorData.website,
          profile_image_url: creatorData.profile_image_url,
          creator_type: creatorData.creator_type,
        })
        .eq('user_id', user.id);

      if (creatorError) throw creatorError;

      // Mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Onboarding completed",
        description: "Welcome to NINO!",
      });

      navigate('/creator/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Error completing onboarding",
        description: error.message || "Please try again.",
      });
    }
  };

  return (
    <CreatorOnboardingForm
      currentStep={currentStep}
      creatorData={creatorData}
      onUpdateField={handleUpdateField}
      onSubmit={handleSubmit}
    />
  );
};

export default CreatorOnboarding;