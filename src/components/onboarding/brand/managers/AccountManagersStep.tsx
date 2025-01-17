import { motion } from "framer-motion";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";
import { useAccountManagers } from "./hooks/useAccountManagers";

const AccountManagersStep = () => {
  const {
    showAddManager,
    setShowAddManager,
    selectedPermissions,
    setSelectedPermissions,
    accountManagers,
    addAccountManager,
    removeManager
  } = useAccountManagers();

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
        />
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;