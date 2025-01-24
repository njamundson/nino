import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  invitation_status?: string;
  permissions?: string[];
}

export const useAccountManagers = () => {
  const { toast } = useToast();
  const [showAddManager, setShowAddManager] = useState(false);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);

  const addAccountManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brandData) throw new Error("Brand not found");

      const newManager = {
        brand_id: brandData.id,
        name: formData.get("managerName") as string,
        email: formData.get("managerEmail") as string,
        role: formData.get("managerRole") as string,
        invitation_status: 'pending',
        permissions: ['view_campaigns', 'manage_applications']
      };

      const { data: manager, error } = await supabase
        .from('brand_managers')
        .insert(newManager)
        .select()
        .single();

      if (error) throw error;

      setAccountManagers([...accountManagers, manager as AccountManager]);
      setShowAddManager(false);
      form.reset();

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
    } catch (error) {
      console.error('Error inviting manager:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeManager = async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_managers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccountManagers(accountManagers.filter(manager => manager.id !== id));
      toast({
        title: "Success",
        description: "Account manager removed successfully",
      });
    } catch (error) {
      console.error('Error removing manager:', error);
      toast({
        title: "Error",
        description: "Failed to remove manager. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadManagers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brandData) return;

      const { data: managers, error } = await supabase
        .from('brand_managers')
        .select('*')
        .eq('brand_id', brandData.id);

      if (error) throw error;
      setAccountManagers(managers as AccountManager[]);
    } catch (error) {
      console.error('Error loading managers:', error);
    }
  };

  return {
    showAddManager,
    setShowAddManager,
    accountManagers,
    addAccountManager,
    removeManager,
    loadManagers,
  };
};