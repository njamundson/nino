import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSignInWithEmail = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Check if user is a brand or creator
      const { data: brand } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      const { data: creator } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      // Store user type in localStorage for routing
      if (brand) {
        localStorage.setItem('userType', 'brand');
      } else if (creator) {
        localStorage.setItem('userType', 'creator');
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
  };
};