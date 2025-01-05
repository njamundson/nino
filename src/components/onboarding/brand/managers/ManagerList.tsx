import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  return (
    <div className="space-y-3">
      {managers.map((manager, index) => (
        <motion.div
          key={manager.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-nino-bg rounded-xl hover:bg-nino-bg/80 transition-colors"
        >
          <div className="space-y-1">
            <p className="font-medium text-nino-text">{manager.name}</p>
            <p className="text-sm text-nino-gray">{manager.email}</p>
            <p className="text-xs text-nino-primary">{manager.role}</p>
            <div className="mt-2">
              <ToggleGroup
                type="multiple"
                value={manager.permissions}
                onValueChange={(value) => onUpdatePermissions(manager.id, value)}
                className="flex flex-wrap gap-1"
              >
                <ToggleGroupItem
                  value="edit_content"
                  size="sm"
                  className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Edit Content
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="manage_team"
                  size="sm"
                  className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Manage Team
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="view_analytics"
                  size="sm"
                  className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  View Analytics
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="publish_content"
                  size="sm"
                  className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Publish Content
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveManager(manager.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ManagerList;