import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AccountManagersStepProps {
  accountManagers: AccountManager[];
  onUpdateManagers: (managers: AccountManager[]) => void;
}

const AccountManagersStep = ({
  accountManagers,
  onUpdateManagers,
}: AccountManagersStepProps) => {
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const addAccountManager = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newManager = {
      id: Date.now().toString(),
      name: formData.get("managerName") as string,
      email: formData.get("managerEmail") as string,
      role: formData.get("managerRole") as string,
      permissions: selectedPermissions,
    };
    onUpdateManagers([...accountManagers, newManager]);
    setShowAddManager(false);
    setSelectedPermissions([]);
    form.reset();
  };

  const removeManager = (id: string) => {
    onUpdateManagers(accountManagers.filter(manager => manager.id !== id));
  };

  const updateManagerPermissions = (managerId: string, permissions: string[]) => {
    onUpdateManagers(
      accountManagers.map(manager =>
        manager.id === managerId
          ? { ...manager, permissions }
          : manager
      )
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-[40px] font-medium text-nino-text">Account Managers</h1>
        <p className="text-nino-gray text-xl">Add team members to your brand account</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-2xl font-medium text-nino-text">Team Members</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddManager(true)}
            className="border-2 border-nino-primary text-nino-primary hover:bg-nino-primary hover:text-white px-8 py-6 text-lg h-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team Member
          </Button>
        </div>

        {showAddManager && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 border rounded-xl bg-nino-bg"
            onSubmit={addAccountManager}
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="managerName"
                placeholder="Name"
                required
                className="bg-white border-transparent focus:border-nino-primary h-12"
              />
              <Input
                name="managerEmail"
                type="email"
                placeholder="Email"
                required
                className="bg-white border-transparent focus:border-nino-primary h-12"
              />
            </div>
            <Input
              name="managerRole"
              placeholder="Role (e.g., Admin, Editor)"
              required
              className="bg-white border-transparent focus:border-nino-primary h-12"
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Permissions</Label>
              <ToggleGroup
                type="multiple"
                value={selectedPermissions}
                onValueChange={setSelectedPermissions}
                className="flex flex-wrap gap-2"
              >
                <ToggleGroupItem
                  value="edit_content"
                  className="data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Edit Content
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="manage_team"
                  className="data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Manage Team
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="view_analytics"
                  className="data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  View Analytics
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="publish_content"
                  className="data-[state=on]:bg-nino-primary data-[state=on]:text-white"
                >
                  Publish Content
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddManager(false);
                  setSelectedPermissions([]);
                }}
                className="hover:bg-gray-100 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-nino-primary hover:bg-nino-primary/90 text-white h-12"
              >
                Add Member
              </Button>
            </div>
          </motion.form>
        )}

        <div className="space-y-3">
          {accountManagers.map((manager) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                    onValueChange={(value) => updateManagerPermissions(manager.id, value)}
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
                onClick={() => removeManager(manager.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountManagersStep;