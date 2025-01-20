import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const RequirementsNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-[400px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{data.label}</h3>
        
        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="flex gap-2">
            <Input placeholder="Add a requirement" />
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Deliverables</Label>
          <div className="flex gap-2">
            <Input placeholder="Add a deliverable" />
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(RequirementsNode);