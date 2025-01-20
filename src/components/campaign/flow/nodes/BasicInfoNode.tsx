import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BasicInfoNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-[400px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{data.label}</h3>
        
        <div className="space-y-2">
          <Label>Project Title</Label>
          <Input placeholder="Enter project title" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Describe your campaign" />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="Where will this take place?" />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(BasicInfoNode);