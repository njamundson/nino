import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ManagerPermissionsProps {
  permissions: string[];
}

const ManagerPermissions = ({ permissions }: ManagerPermissionsProps) => {
  return (
    <ToggleGroup
      type="multiple"
      value={permissions}
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
  );
};

export default ManagerPermissions;