import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ManagerForm from "./ManagerForm";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import { Label } from "@/components/ui/label";
import ManagerCard from "./ManagerCard";

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

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        toast({
          title: "Error",
          description: "Error fetching brand data",
          variant: "destructive",
        });
        return;
      }

      if (!brand) {
        toast({
          title: "Error",
          description: "Please complete brand setup first",
          variant: "destructive",
        });
        return;
      }

      // Check if 5 minutes have passed since brand creation
      const createdAt = new Date(brand.created_at);
      const fiveMinutesAfterCreation = new Date(createdAt.getTime() + 5 * 60000);
      const now = new Date();

      if (now < fiveMinutesAfterCreation) {
        const remainingMinutes = Math.ceil((fiveMinutesAfterCreation.getTime() - now.getTime()) / 60000);
        toast({
          title: "Please wait",
          description: `You can add team members ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} after brand creation`,
          variant: "destructive",
        });
        return;
      }

      const { data: manager, error: managerError } = await supabase
        .from('brand_managers')
        .insert({
          brand_id: brand.id,
          name: formData.get("managerName")?.toString(),
          email: formData.get("managerEmail")?.toString(),
          role: formData.get("managerRole")?.toString(),
          permissions: selectedPermissions,
          invitation_status: 'pending'
        })
        .select()
        .single();

      if (managerError) {
        if (managerError.code === 'PGRST109') {
          toast({
            title: "Access Denied",
            description: "Please wait 5 minutes after brand creation before adding team members",
            variant: "destructive",
          });
          return;
        }
        throw managerError;
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
      console.error('Error removing manager:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
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

        <div className="space-y-2">
          {accountManagers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onUpdatePermissions={(permissions) => {
                setAccountManagers(managers =>
                  managers.map(m =>
                    m.id === manager.id ? { ...m, permissions } : m
                  )
                );
              }}
              onRemove={() => removeManager(manager.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;