// This file calculates the size and position of graph nodes so the rabbit hole layout stays organized and readable.

import dagre from '@dagrejs/dagre';

const AVG_CHAR_WIDTH = 7.4;
const HORIZONTAL_PADDING = 34;
const MIN_WIDTH = 130;
const SAFETY_MAX_WIDTH = 600;
const HEIGHT = 50;

export const estimateNodeSize = (label = '') => {
  const naturalWidth = label.length * AVG_CHAR_WIDTH + HORIZONTAL_PADDING;
  const width = Math.round(Math.min(Math.max(naturalWidth, MIN_WIDTH), SAFETY_MAX_WIDTH));
  return { width, height: HEIGHT };
};

export const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 160 });

  const sizes = {};

  nodes.forEach((node) => {
    const size = estimateNodeSize(node.data?.label || node.id);
    sizes[node.id] = size;
    dagreGraph.setNode(node.id, size);
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { width, height } = sizes[node.id];

    return {
      ...node,
      style: { ...(node.style || {}), width: `${width}px`, height: `${height}px` },
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};