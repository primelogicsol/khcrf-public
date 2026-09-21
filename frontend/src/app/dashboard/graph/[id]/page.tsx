"use client";

import React, { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import { ReactFlow, Background, Controls, Node, Edge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function KnowledgeGraphVisualization({ params }: { params: { id: string } }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { data, error, isLoading } = useSWR(`/api/graph/${params.id}?depth=2`, fetcher);

  useEffect(() => {
    if (data && data.nodes && data.edges) {
      // Basic layout logic: Center is (0,0), others are positioned in a circle
      const radius = 250;
      
      const mappedNodes: Node[] = data.nodes.map((node: any, index: number) => {
        let x = 0;
        let y = 0;
        
        // If it's the center node, keep it at 0,0
        if (node.id !== params.id) {
          const angle = (index / (data.nodes.length - 1)) * 2 * Math.PI;
          x = radius * Math.cos(angle);
          y = radius * Math.sin(angle);
        }

        return {
          id: node.id,
          position: { x, y },
          data: { label: `${node.label} (${node.type})` },
          style: {
            background: node.id === params.id ? '#3b82f6' : '#ffffff',
            color: node.id === params.id ? '#ffffff' : '#000000',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
          },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        };
      });

      const mappedEdges: Edge[] = data.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
      }));

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    }
  }, [data, params.id]);

  if (isLoading) return <div className="p-10">Loading Knowledge Graph...</div>;
  if (error) return <div className="p-10 text-red-500">Failed to load graph.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Knowledge Graph Visualization</h1>
        <p className="text-gray-500">Displaying relationship engine ego-graph (Depth 2)</p>
      </div>
      
      <div className="flex-1 border rounded-xl overflow-hidden shadow-sm bg-gray-50">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          fitView 
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
