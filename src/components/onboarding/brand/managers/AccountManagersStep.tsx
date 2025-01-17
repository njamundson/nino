import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ManagerForm from "./ManagerForm";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const navigate = useNavigate();

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

      // Get the brand for the current user
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) {
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
        .eq('brand_id', brand.id)
        .eq('email', formData.get("managerEmail")?.toString())
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

  const handleComplete = () => {
    navigate("/brand/dashboard");
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
            <motion.div
              key={manager.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-nino-bg rounded-lg hover:bg-nino-bg/80 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm text-nino-text">{manager.name}</p>
                <p className="text-xs text-nino-gray">{manager.email}</p>
                <p className="text-xs text-nino-primary">{manager.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeManager(manager.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleComplete}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
        >
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;