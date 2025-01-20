import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CompensationNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-[400px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{data.label}</h3>
        
        <div className="space-y-2">
          <Label>Payment Details</Label>
          <Input placeholder="e.g. $500 per post" />
        </div>

        <div className="space-y-2">
          <Label>Additional Compensation</Label>
          <Textarea placeholder="Describe any additional perks or compensation" />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CompensationNode);