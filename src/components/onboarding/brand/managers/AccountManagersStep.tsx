import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";
import { Button } from "@/components/ui/button";

export interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const AccountManagersStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);

  const addAccountManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newManager = {
      id: Date.now().toString(),
      name: formData.get("managerName") as string,
      email: formData.get("managerEmail") as string,
      role: formData.get("managerRole") as string,
      permissions: selectedPermissions,
    };

    setAccountManagers([...accountManagers, newManager]);
    setShowAddManager(false);
    setSelectedPermissions([]);
    form.reset();
  };

  const removeManager = (id: string) => {
    setAccountManagers(accountManagers.filter(manager => manager.id !== id));
  };

  const updateManagerPermissions = async (managerId: string, permissions: string[]) => {
    setAccountManagers(
      accountManagers.map(manager =>
        manager.id === managerId
          ? { ...manager, permissions }
          : manager
      )
    );
  };

  const handleComplete = async () => {
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

      // Get the brand ID for the current user
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (brandError || !brand) {
        toast({
          title: "Error",
          description: "Could not find brand information",
          variant: "destructive",
        });
        return;
      }

      // Insert all managers
      const { error: managersError } = await supabase
        .from('brand_managers')
        .insert(
          accountManagers.map(manager => ({
            brand_id: brand.id,
            name: manager.name,
            email: manager.email,
            role: manager.role,
            permissions: manager.permissions,
          }))
        );

      if (managersError) {
        toast({
          title: "Error",
          description: "Failed to add team members",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Brand setup completed successfully",
      });

      navigate("/brand/dashboard");
    } catch (error) {
      console.error('Error in handleComplete:', error);
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
          <AddManagerButton onClick={() => setShowAddManager(true)} />
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
          onRemoveManager={removeManager}
          onUpdatePermissions={updateManagerPermissions}
        />

        <div className="flex justify-between pt-6">
          <Button
            onClick={() => navigate("/onboarding/brand")}
            variant="outline"
            className="text-nino-gray hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;