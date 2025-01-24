import { motion } from "framer-motion";
import { useEffect } from "react";
import AccountManagersHeader from "./AccountManagersHeader";
import AddManagerButton from "./AddManagerButton";
import ManagerForm from "./ManagerForm";
import ManagerList from "./ManagerList";
import { useAccountManagers } from "./hooks/useAccountManagers";

const AccountManagersStep = () => {
  const {
    showAddManager,
    setShowAddManager,
    accountManagers,
    addAccountManager,
    removeManager,
    loadManagers,
  } = useAccountManagers();

  useEffect(() => {
    loadManagers();
  }, []);

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
            onCancel={() => {
              setShowAddManager(false);
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