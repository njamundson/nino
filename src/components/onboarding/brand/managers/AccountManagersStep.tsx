import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";

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
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm"
      >
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-nino-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-nino-text">
            Account Managers
          </h1>
          <p className="text-nino-gray">
            Add team members to your brand account
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium text-nino-text">
              Team Members
            </Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddManager(true)}
              className="border-2 border-nino-primary text-nino-primary hover:bg-nino-primary hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
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

        <div className="flex justify-between pt-4">
          <Button
            onClick={() => navigate("/onboarding/brand")}
            variant="outline"
            className="text-nino-gray hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            Complete Setup
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountManagersStep;