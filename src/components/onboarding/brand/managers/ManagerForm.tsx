import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

interface ManagerFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  onCancel: () => void;
}

const ManagerForm = ({
  onSubmit,
  selectedPermissions,
  setSelectedPermissions,
  onCancel,
}: ManagerFormProps) => {
  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(
      selectedPermissions.includes(permission)
        ? selectedPermissions.filter((p) => p !== permission)
        : [...selectedPermissions, permission]
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 border rounded-lg bg-nino-bg"
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="managerName"
          placeholder="Name"
          required
          className="bg-white border-transparent focus:border-nino-primary h-10"
        />
        <Input
          name="managerEmail"
          type="email"
          placeholder="Email"
          required
          className="bg-white border-transparent focus:border-nino-primary h-10"
        />
      </div>
      <Input
        name="managerRole"
        placeholder="Role (e.g., Admin, Editor)"
        required
        className="bg-white border-transparent focus:border-nino-primary h-10"
      />
      <div className="space-y-4">
        <Label className="text-sm font-medium">Permissions</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="post-projects" className="text-sm">
              Post Projects
            </Label>
            <Switch
              id="post-projects"
              checked={selectedPermissions.includes("post_projects")}
              onCheckedChange={() => handlePermissionToggle("post_projects")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="message-creators" className="text-sm">
              Message Creators
            </Label>
            <Switch
              id="message-creators"
              checked={selectedPermissions.includes("message_creators")}
              onCheckedChange={() => handlePermissionToggle("message_creators")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="add-admins" className="text-sm">
              Add new Admins
            </Label>
            <Switch
              id="add-admins"
              checked={selectedPermissions.includes("add_admins")}
              onCheckedChange={() => handlePermissionToggle("add_admins")}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="hover:bg-gray-100 h-9"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-nino-primary hover:bg-nino-primary/90 text-white h-9"
        >
          Save
        </Button>
      </div>
    </motion.form>
  );
};

export default ManagerForm;