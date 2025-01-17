import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import ManagerPermissions from "./ManagerPermissions";
import type { AccountManager } from "./hooks/useAccountManagers";

interface ManagerCardProps {
  manager: AccountManager;
  onRemove: () => void;
}

const ManagerCard = ({ manager, onRemove }: ManagerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-3 bg-nino-bg rounded-lg hover:bg-nino-bg/80 transition-colors"
    >
      <div className="space-y-1 w-full">
        <p className="font-medium text-sm text-nino-text">{manager.name}</p>
        <p className="text-xs text-nino-gray">{manager.email}</p>
        <p className="text-xs text-nino-primary">{manager.role}</p>
        <div className="mt-2">
          <ManagerPermissions permissions={manager.permissions} />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default ManagerCard;