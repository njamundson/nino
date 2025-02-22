import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export interface RequirementsProps {
  formData: {
    requirements: string[];
    perks: string[];
    deliverables: string[];
  };
  setFormData: (data: any) => void;
}

const Requirements = ({ formData, setFormData }: RequirementsProps) => {
  const [requirement, setRequirement] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const { toast } = useToast();

  const addRequirement = () => {
    if (requirement.trim()) {
      if (formData.requirements?.length >= 10) {
        toast({
          title: "Maximum requirements reached",
          description: "You can only add up to 10 requirements",
          variant: "destructive",
        });
        return;
      }
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), requirement.trim()],
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
      if (formData.deliverables?.length >= 10) {
        toast({
          title: "Maximum deliverables reached",
          description: "You can only add up to 10 deliverables",
          variant: "destructive",
        });
        return;
      }
      setFormData({
        ...formData,
        deliverables: [...(formData.deliverables || []), deliverable.trim()],
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

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Requirements</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addRequirement)}
            className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
          />
          <Button 
            onClick={addRequirement}
            size="icon"
            variant="outline"
            className="bg-gray-50/50 hover:bg-gray-50/80 border-0 rounded-xl w-12 h-12 flex items-center justify-center shrink-0 transition-colors shadow-sm ring-1 ring-gray-200/70"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requirements?.map((req: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 bg-gray-50/80 hover:bg-gray-100/80 border-0 rounded-lg transition-colors"
            >
              {req}
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => removeRequirement(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Deliverables</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a deliverable"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addDeliverable)}
            className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
          />
          <Button 
            onClick={addDeliverable}
            size="icon"
            variant="outline"
            className="bg-gray-50/50 hover:bg-gray-50/80 border-0 rounded-xl w-12 h-12 flex items-center justify-center shrink-0 transition-colors shadow-sm ring-1 ring-gray-200/70"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.deliverables?.map((del: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 bg-gray-50/80 hover:bg-gray-100/80 border-0 rounded-lg transition-colors"
            >
              {del}
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
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