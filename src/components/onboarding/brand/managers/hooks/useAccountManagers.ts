import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAccountManagers = () => {
  const { toast } = useToast();
  const [showAddManager, setShowAddManager] = useState(false);
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
    };

    setAccountManagers([...accountManagers, newManager]);
    setShowAddManager(false);
    form.reset();

    toast({
      title: "Success",
      description: "Account manager added successfully",
    });
  };

  const removeManager = (id: string) => {
    setAccountManagers(accountManagers.filter(manager => manager.id !== id));
    toast({
      title: "Success",
      description: "Account manager removed successfully",
    });
  };

  return {
    showAddManager,
    setShowAddManager,
    accountManagers,
    addAccountManager,
    removeManager,
  };
};