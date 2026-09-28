// This file creates a custom React Flow node that displays a topic and provides connection points for linking it to other topics.
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  return (
    <div className={`react-flow__node-custom ${data.status}`} title={data.label}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0 }}
      />
      <div className="node-label">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0 }}
      />
    </div>
  );
};
export default memo(CustomNode);