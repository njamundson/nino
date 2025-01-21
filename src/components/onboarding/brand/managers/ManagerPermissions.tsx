import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ManagerPermissionsProps {
  permissions: string[];
  onUpdate?: (permissions: string[]) => Promise<void>;
}

const ManagerPermissions = ({ permissions, onUpdate }: ManagerPermissionsProps) => {
  return (
    <ToggleGroup
      type="multiple"
      value={permissions}
      onValueChange={onUpdate}
      className="flex flex-wrap gap-1"
    >
      <ToggleGroupItem
        value="post_projects"
        size="sm"
        className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
      >
        Post Projects
      </ToggleGroupItem>
      <ToggleGroupItem
        value="message_creators"
        size="sm"
        className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
      >
        Message Creators
      </ToggleGroupItem>
      <ToggleGroupItem
        value="add_admins"
        size="sm"
        className="text-xs data-[state=on]:bg-nino-primary data-[state=on]:text-white"
      >
        Add Admins
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ManagerPermissions;