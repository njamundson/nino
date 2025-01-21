import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ManagerFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const ManagerForm = ({
  onSubmit,
  onCancel,
}: ManagerFormProps) => {
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