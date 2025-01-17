import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import ManagerPermissions from "./ManagerPermissions";

interface ManagerCardProps {
  manager: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  onUpdatePermissions: (permissions: string[]) => void;
  onRemove: () => void;
}

const ManagerCard = ({ manager, onUpdatePermissions, onRemove }: ManagerCardProps) => {
  const handlePermissionToggle = (permission: string) => {
    const newPermissions = manager.permissions.includes(permission)
      ? manager.permissions.filter((p) => p !== permission)
      : [...manager.permissions, permission];
    onUpdatePermissions(newPermissions);
  };

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
          <ManagerPermissions
            managerId={manager.id}
            permissions={manager.permissions}
            onPermissionToggle={handlePermissionToggle}
          />
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