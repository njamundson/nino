import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 border rounded-xl bg-nino-bg"
      onSubmit={onSubmit}
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
          onClick={onCancel}
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
  );
};

export default ManagerForm;