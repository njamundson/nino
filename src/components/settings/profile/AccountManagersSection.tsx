import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ManagerForm from "@/components/onboarding/brand/managers/ManagerForm";
import ManagerList from "@/components/onboarding/brand/managers/ManagerList";
import AddManagerButton from "@/components/onboarding/brand/managers/AddManagerButton";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const AccountManagersSection = () => {
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
      if (!user) throw new Error("No authenticated user");

      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brandData) throw new Error("Brand not found");

      const { data: manager, error } = await supabase
        .from('brand_managers')
        .insert({
          brand_id: brandData.id,
          name: formData.get("managerName") as string,
          email: formData.get("managerEmail") as string,
          role: formData.get("managerRole") as string,
          permissions: selectedPermissions,
        })
        .select()
        .single();

      if (error) throw error;

      setAccountManagers([...accountManagers, manager as AccountManager]);
      setShowAddManager(false);
      setSelectedPermissions([]);
      form.reset();

      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
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
        description: "Team member removed successfully",
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateManagerPermissions = async (managerId: string, permissions: string[]) => {
    try {
      const { error } = await supabase
        .from('brand_managers')
        .update({ permissions })
        .eq('id', managerId);

      if (error) throw error;

      setAccountManagers(
        accountManagers.map(manager =>
          manager.id === managerId
            ? { ...manager, permissions }
            : manager
        )
      );

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Account Managers</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
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
        onUpdatePermissions={updateManagerPermissions}
        onRemoveManager={removeManager}
      />
    </Card>
  );
};

export default AccountManagersSection;