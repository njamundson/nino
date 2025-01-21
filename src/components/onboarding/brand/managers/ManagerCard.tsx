import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X } from "lucide-react";
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
      className="flex items-center justify-between p-4 bg-nino-bg rounded-xl hover:bg-nino-bg/80 transition-colors"
    >
      <div className="space-y-1">
        <p className="font-medium text-nino-text">{manager.name}</p>
        <p className="text-sm text-nino-gray">{manager.email}</p>
        <p className="text-xs text-nino-primary">{manager.role}</p>
        <p className="text-xs text-nino-gray mt-2">Full Access</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default ManagerCard;