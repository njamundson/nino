import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export const useAccountManagers = () => {
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

  return {
    showAddManager,
    setShowAddManager,
    selectedPermissions,
    setSelectedPermissions,
    accountManagers,
    addAccountManager,
    removeManager,
    updateManagerPermissions,
  };
};