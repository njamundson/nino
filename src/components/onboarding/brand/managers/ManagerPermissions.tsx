import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ManagerPermissionsProps {
  managerId: string;
  permissions: string[];
  onPermissionToggle: (permission: string) => void;
}

const ManagerPermissions = ({
  managerId,
  permissions,
  onPermissionToggle,
}: ManagerPermissionsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`post-projects-${managerId}`} className="text-xs">
          Post Projects
        </Label>
        <Switch
          id={`post-projects-${managerId}`}
          checked={permissions.includes("post_projects")}
          onCheckedChange={() => onPermissionToggle("post_projects")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={`message-creators-${managerId}`} className="text-xs">
          Message Creators
        </Label>
        <Switch
          id={`message-creators-${managerId}`}
          checked={permissions.includes("message_creators")}
          onCheckedChange={() => onPermissionToggle("message_creators")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={`add-admins-${managerId}`} className="text-xs">
          Add new Admins
        </Label>
        <Switch
          id={`add-admins-${managerId}`}
          checked={permissions.includes("add_admins")}
          onCheckedChange={() => onPermissionToggle("add_admins")}
        />
      </div>
    </div>
  );
};

export default ManagerPermissions;