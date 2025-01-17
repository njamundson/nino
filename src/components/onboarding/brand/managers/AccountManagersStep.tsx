import { useState } from "react";
import { motion } from "framer-motion";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";
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

      // Get the brand ID for the current user
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (brandError || !brandData) {
        console.error('Error fetching brand:', brandError);
        toast({
          title: "Error",
          description: "Could not find associated brand",
          variant: "destructive",
        });
        return;
      }

      // Create the manager invitation
      const { data: manager, error: managerError } = await supabase
        .from('brand_managers')
        .insert({
          brand_id: brandData.id,
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
      className="w-full max-w-md space-y-8"
    >
      <AccountManagersHeader />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-medium text-nino-text">
            Team Members
          </Label>
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
          onUpdatePermissions={() => {}}
          onRemoveManager={() => {}}
        />
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;