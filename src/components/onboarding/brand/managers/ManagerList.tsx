import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface ManagerListProps {
  managers: AccountManager[];
  onUpdatePermissions: (managerId: string, permissions: string[]) => void;
  onRemoveManager: (id: string) => void;
}

const ManagerList = ({
  managers,
  onUpdatePermissions,
  onRemoveManager,
}: ManagerListProps) => {
  const handlePermissionToggle = (managerId: string, permission: string, currentPermissions: string[]) => {
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];
    onUpdatePermissions(managerId, newPermissions);
  };

  return (
    <div className="space-y-2">
      {managers.map((manager, index) => (
        <motion.div
          key={manager.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-nino-bg rounded-lg hover:bg-nino-bg/80 transition-colors"
        >
          <div className="space-y-1 w-full">
            <p className="font-medium text-sm text-nino-text">{manager.name}</p>
            <p className="text-xs text-nino-gray">{manager.email}</p>
            <p className="text-xs text-nino-primary">{manager.role}</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`post-projects-${manager.id}`} className="text-xs">
                  Post Projects
                </Label>
                <Switch
                  id={`post-projects-${manager.id}`}
                  checked={manager.permissions.includes("post_projects")}
                  onCheckedChange={() => handlePermissionToggle(manager.id, "post_projects", manager.permissions)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`message-creators-${manager.id}`} className="text-xs">
                  Message Creators
                </Label>
                <Switch
                  id={`message-creators-${manager.id}`}
                  checked={manager.permissions.includes("message_creators")}
                  onCheckedChange={() => handlePermissionToggle(manager.id, "message_creators", manager.permissions)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`add-admins-${manager.id}`} className="text-xs">
                  Add new Admins
                </Label>
                <Switch
                  id={`add-admins-${manager.id}`}
                  checked={manager.permissions.includes("add_admins")}
                  onCheckedChange={() => handlePermissionToggle(manager.id, "add_admins", manager.permissions)}
                />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveManager(manager.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ManagerList;