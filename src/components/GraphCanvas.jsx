// This file creates the interactive graph where users can view, navigate, and select connected topics in the rabbit hole.

import React, { useEffect, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };
const FIT_VIEW_BOUNDS = { minZoom: 0.5, maxZoom: 1.3 };

const FlowInner = ({ nodes, edges, onNodeClick, focusTarget, translationToken }) => {
  const { fitView } = useReactFlow();
  const seenIds = useRef(new Set());
  const lastTranslationToken = useRef(translationToken);
  const [interactive, setInteractive] = useState(true);

  const fitViewTo = (ids, opts, delay) => {
    const timeout = setTimeout(() => {
      fitView({ nodes: ids.map((id) => ({ id })), ...FIT_VIEW_BOUNDS, ...opts });
    }, delay);
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    const currentIds = nodes.map((n) => n.id);

    if (translationToken !== lastTranslationToken.current) {
      lastTranslationToken.current = translationToken;
      seenIds.current = new Set(currentIds);
      return;
    }

    const newIds = currentIds.filter((id) => !seenIds.current.has(id));
    seenIds.current = new Set(currentIds);
    if (newIds.length === 0) return;

    const activeNode = nodes.find((n) => n.data.status === 'current');
    const focusIds = new Set(newIds);
    if (activeNode) focusIds.add(activeNode.id);

    return fitViewTo(Array.from(focusIds), { padding: 0.4, duration: 600 }, 60);
  }, [nodes, fitView, translationToken]);

  useEffect(() => {
    if (!focusTarget || !nodes.some((n) => n.id === focusTarget.id)) return;
    return fitViewTo([focusTarget.id], { padding: 0.6, duration: 500 }, 30);
  }, [focusTarget, fitView]);

  const interactiveProps = {
    nodesDraggable: interactive,
    nodesConnectable: interactive,
    elementsSelectable: interactive,
    panOnDrag: interactive,
    zoomOnScroll: interactive,
    zoomOnPinch: interactive,
    zoomOnDoubleClick: interactive
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => onNodeClick(node.id)}
      proOptions={{ hideAttribution: true }}
      {...interactiveProps}
      fitView
    >
      <Background color="#7067CF" gap={16} />
      <Controls onInteractiveChange={setInteractive} />
    </ReactFlow>
  );
};

export const GraphCanvas = ({ nodes, edges, onNodeClick, loading, t, focusTarget, translationToken }) => {
  return (
    <div className="canvas-wrapper">
      {loading && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'var(--purple)', color: 'var(--mint)', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold' }}>
          {t.fetchingLinks}
        </div>
      )}
      <ReactFlowProvider>
        <FlowInner nodes={nodes} edges={edges} onNodeClick={onNodeClick} focusTarget={focusTarget} translationToken={translationToken} />
      </ReactFlowProvider>
    </div>
  );
};