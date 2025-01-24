import { motion } from "framer-motion";
import { AccountManager } from "./hooks/useAccountManagers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ManagerListProps {
  managers: AccountManager[];
  onRemoveManager: (id: string) => void;
}

const ManagerList = ({ managers, onRemoveManager }: ManagerListProps) => {
  if (!managers.length) {
    return (
      <div className="text-center text-gray-500">
        No team members added yet
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
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <div className="space-y-1">
            <h4 className="font-medium">{manager.name}</h4>
            <p className="text-sm text-gray-500">{manager.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{manager.role}</Badge>
              {manager.invitation_status && (
                <Badge variant={manager.invitation_status === 'accepted' ? 'default' : 'outline'}>
                  {manager.invitation_status === 'pending' ? 'Pending' : 'Accepted'}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveManager(manager.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ManagerList;