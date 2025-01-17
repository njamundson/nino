import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <AccountManagersHeader />

      <div className="space-y-4">
        <div className="flex justify-center">
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
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;