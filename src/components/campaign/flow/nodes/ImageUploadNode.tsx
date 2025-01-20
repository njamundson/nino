import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ImagePlus, Camera } from 'lucide-react';

const ImageUploadNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="w-80 h-56 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center group cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
        <div className="text-center space-y-3 px-6">
          <Camera className="mx-auto h-12 w-12 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" />
          <div>
            <p className="text-sm font-medium text-gray-900">{data.label}</p>
            <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x800px</p>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ImageUploadNode);