import { motion } from "framer-motion";
import ManagerCard from "./ManagerCard";
import type { AccountManager } from "./hooks/useAccountManagers";

interface ManagerListProps {
  managers: AccountManager[];
  onRemoveManager: (id: string) => void;
}

const ManagerList = ({ managers, onRemoveManager }: ManagerListProps) => {
  if (managers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No team members added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {managers.map((manager) => (
        <motion.div
          key={manager.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ManagerCard
            manager={manager}
            onRemove={() => onRemoveManager(manager.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ManagerList;