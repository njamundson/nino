import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ManagerForm from "./ManagerForm";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const AccountManagersStep = () => {
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const { toast } = useToast();

  // Load existing managers on component mount
  useEffect(() => {
    const loadExistingManagers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (brand) {
          const { data: managers } = await supabase
            .from('brand_managers')
            .select('*')
            .eq('brand_id', brand.id);

          if (managers) {
            setAccountManagers(managers as AccountManager[]);
          }
        }
      } catch (error) {
        console.error('Error loading managers:', error);
      }
    };

    loadExistingManagers();
  }, []);

  const addAccountManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

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

      // First, get or create the brand
      let brandId: string;
      
      // Try to get existing brand
      const { data: existingBrand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingBrand) {
        brandId = existingBrand.id;
      } else {
        // If no brand exists, show error - brand should be created in previous step
        toast({
          title: "Error",
          description: "Please complete brand setup first",
          variant: "destructive",
        });
        return;
      }

      // Check if manager with this email already exists
      const { data: existingManager } = await supabase
        .from('brand_managers')
        .select('*')
        .eq('brand_id', brandId)
        .eq('email', formData.get("managerEmail"))
        .single();

      if (existingManager) {
        toast({
          title: "Error",
          description: "A team member with this email already exists",
          variant: "destructive",
        });
        return;
      }

      // Create the manager invitation
      const { data: manager, error: managerError } = await supabase
        .from('brand_managers')
        .insert({
          brand_id: brandId,
          name: formData.get("managerName") as string,
          email: formData.get("managerEmail") as string,
          role: formData.get("managerRole") as string,
          permissions: selectedPermissions,
          invitation_status: 'pending'
        })
        .select()
        .single();

      if (managerError) {
        console.error('Error creating manager:', managerError);
        toast({
          title: "Error",
          description: "Failed to add team member",
          variant: "destructive",
        });
        return;
      }

      setAccountManagers([...accountManagers, manager as AccountManager]);
      setShowAddManager(false);
      setSelectedPermissions([]);
      form.reset();

      toast({
        title: "Success",
        description: "Team member invited successfully",
      });
    } catch (error) {
      console.error('Error in addAccountManager:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <AccountManagersHeader />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Team Members</Label>
          <AddManagerButton
            onClick={() => setShowAddManager(true)}
            disabled={showAddManager}
          />
        </div>

        {showAddManager && (
          <ManagerForm
            onSubmit={addAccountManager}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            onCancel={() => {
              setShowAddManager(false);
              setSelectedPermissions([]);
            }}
          />
        )}

        <ManagerList
          managers={accountManagers}
          onUpdatePermissions={() => {}}
          onRemoveManager={() => {}}
        />
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;