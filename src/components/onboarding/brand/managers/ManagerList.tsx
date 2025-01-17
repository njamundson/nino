import { motion } from "framer-motion";
import ManagerCard from "./ManagerCard";
import type { AccountManager } from "./hooks/useAccountManagers";

interface ManagerListProps {
  managers: AccountManager[];
  onRemoveManager: (id: string) => void;
  onUpdatePermissions?: (managerId: string, permissions: string[]) => Promise<void>;
}

const ManagerList = ({ managers, onRemoveManager, onUpdatePermissions }: ManagerListProps) => {
  return (
    <div className="space-y-2">
      {managers.map((manager) => (
        <ManagerCard
          key={manager.id}
          manager={manager}
          onRemove={() => onRemoveManager(manager.id)}
          onUpdatePermissions={onUpdatePermissions}
        />
      ))}
    </div>
  );
};

export default ManagerList;