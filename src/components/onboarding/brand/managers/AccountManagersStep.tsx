import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";
import AccountManagersHeader from "./AccountManagersHeader";
import NavigationButtons from "./NavigationButtons";
import AddManagerButton from "./AddManagerButton";
import { Label } from "@/components/ui/label";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const AccountManagersStep = () => {
  const navigate = useNavigate();
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const addAccountManager = (e: React.FormEvent<HTMLFormElement>) => {
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

  const updateManagerPermissions = (managerId: string, permissions: string[]) => {
    setAccountManagers(
      accountManagers.map((manager) =>
        manager.id === managerId ? { ...manager, permissions } : manager
      )
    );
  };

  const removeManager = (id: string) => {
    setAccountManagers(accountManagers.filter((manager) => manager.id !== id));
  };

  const handleComplete = () => {
    navigate("/brand/dashboard");
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
          onUpdatePermissions={updateManagerPermissions}
          onRemoveManager={removeManager}
        />
      </div>

      <NavigationButtons onComplete={handleComplete} />
    </motion.div>
  );
};

export default AccountManagersStep;