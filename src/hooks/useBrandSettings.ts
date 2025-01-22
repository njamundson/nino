import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BrandType } from '@/types/brand';

export const useBrandSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: brandData, refetch } = useQuery({
    queryKey: ['brandSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const updateBrandSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const brandType = formData.get('brand_type') as BrandType;
        if (!brandType) throw new Error('Brand type is required');

        const { error } = await supabase
          .from('brands')
          .update({
            company_name: formData.get('company_name'),
            brand_type: brandType,
            description: formData.get('description'),
            website: formData.get('website'),
            instagram: formData.get('instagram'),
            location: formData.get('location'),
            phone_number: formData.get('phone_number'),
            support_email: formData.get('support_email'),
          })
          .eq('user_id', user.id);

        if (error) throw error;

        await refetch();
        toast({
          title: "Settings updated",
          description: "Your brand settings have been updated successfully",
        });
      } catch (error) {
        console.error('Error updating brand settings:', error);
        toast({
          title: "Error",
          description: "Failed to update brand settings",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    }
  });

  return {
    brandData,
    loading,
    updateBrandSettings
  };
};