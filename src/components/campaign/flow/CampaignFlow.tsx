import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BasicInfoNode from './nodes/BasicInfoNode';
import RequirementsNode from './nodes/RequirementsNode';
import CompensationNode from './nodes/CompensationNode';
import ImageUploadNode from './nodes/ImageUploadNode';

const nodeTypes = {
  basicInfo: BasicInfoNode,
  requirements: RequirementsNode,
  compensation: CompensationNode,
  imageUpload: ImageUploadNode,
};

const initialNodes = [
  {
    id: 'image-upload',
    type: 'imageUpload',
    position: { x: 250, y: 0 },
    data: { label: 'Campaign Image' },
  },
  {
    id: 'basic-info',
    type: 'basicInfo',
    position: { x: 250, y: 150 },
    data: { label: 'Basic Information' },
  },
  {
    id: 'requirements',
    type: 'requirements',
    position: { x: 250, y: 350 },
    data: { label: 'Requirements' },
  },
  {
    id: 'compensation',
    type: 'compensation',
    position: { x: 250, y: 550 },
    data: { label: 'Compensation' },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'image-upload',
    target: 'basic-info',
    animated: true,
  },
  {
    id: 'e2',
    source: 'basic-info',
    target: 'requirements',
    animated: true,
  },
  {
    id: 'e3',
    source: 'requirements',
    target: 'compensation',
    animated: true,
  },
];

const CampaignFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[800px] bg-white shadow-sm rounded-3xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50/50"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default CampaignFlow;