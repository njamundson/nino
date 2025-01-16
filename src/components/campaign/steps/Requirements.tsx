import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RequirementsProps {
  formData: any;
  setFormData: (data: any) => void;
}

const Requirements = ({ formData, setFormData }: RequirementsProps) => {
  const [requirement, setRequirement] = useState("");
  const [deliverable, setDeliverable] = useState("");

  const addRequirement = () => {
    if (requirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirement.trim()],
      });
      setRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_: string, i: number) => i !== index),
    });
  };

  const addDeliverable = () => {
    if (deliverable.trim()) {
      setFormData({
        ...formData,
        deliverables: [...formData.deliverables, deliverable.trim()],
      });
      setDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_: string, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label className="text-base font-medium text-gray-900">Requirements</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addRequirement()}
            className="h-12 text-base border-gray-200 focus:border-gray-300 focus:ring-gray-300"
          />
          <Button 
            onClick={addRequirement}
            className="bg-black hover:bg-gray-900 text-white"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requirements.map((req: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 bg-gray-100"
            >
              {req}
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-500"
                onClick={() => removeRequirement(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium text-gray-900">Deliverables</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a deliverable"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addDeliverable()}
            className="h-12 text-base border-gray-200 focus:border-gray-300 focus:ring-gray-300"
          />
          <Button 
            onClick={addDeliverable}
            className="bg-black hover:bg-gray-900 text-white"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.deliverables.map((del: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 bg-gray-100"
            >
              {del}
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-500"
                onClick={() => removeDeliverable(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requirements;