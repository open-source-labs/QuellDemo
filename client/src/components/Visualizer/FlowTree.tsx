import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Controls, Background, Elements, Position, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { parse, DocumentNode, FieldNode, SelectionNode } from 'graphql';

const query = `
  query {
    artist(name: "Frank Ocean") {
      id
      name
      albums {
        id
        name
      }
    }
  }
`;

const ast: DocumentNode = parse(query);

interface NodeData {
  label: string;
}

interface FlowElement extends NodeData {
  id: string;
  position?: Position;
}

const getNode = (
  node: FieldNode | SelectionNode,
  depth: number,
  siblingIndex: number,
  numSiblings: number,
  numNodes: number
): NodeData => {
  const label = node.kind === 'Field' ? node.name.value : node.kind;
  const id = `${node.loc?.start}-${node.loc?.end}`;
  console.log(node.name.value, 'siblingIndex: ', siblingIndex)
  console.log('numNodes: ', numNodes);
  console.log('numSiblings: ', numSiblings)
  return {
    id: id!,
    data: {label},
    position: {
      x: 100 + depth * 150,
      y: 50 + ((siblingIndex + 0.5) / numNodes) * 300 + depth * 100
    }
  };
};



const getEdge = (parent: FieldNode, child: SelectionNode): FlowElement => {
  const parentId = `${parent.loc?.start}-${parent.loc?.end}`;
  const childId = `${child.loc?.start}-${child.loc?.end}`;

  return {
    id: `${parentId}-${childId}`,
    source: parentId,
    target: childId,
  };
};

const buildTree = (
  node: FieldNode | SelectionNode,
  nodes: [],
  edges: [],
  depth = 0
): void => {
  const parent = getNode(node, depth, 0, 0, 1);

  nodes.push(parent);
  // console.log("Parent node: ", parent);

  if (node.selectionSet) {
    const numChildren = node.selectionSet.selections.length;
    node.selectionSet.selections.forEach((childNode, i) => {
      const child = getNode(childNode, depth + 1, i, numChildren, numChildren);
      edges.push(getEdge(node as FieldNode, childNode));
      // console.log("Child node: ", child);
      // console.log("Edge: ", getEdge(node as FieldNode, childNode));
      buildTree(childNode, nodes, edges, depth + 1);
    });
  }
};


const astToTree = (ast: DocumentNode): { nodes: Node[]; edges: Edge[] } => {
  const operation = ast.definitions[0].selectionSet.selections[0];
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  buildTree(operation, nodes, edges, 0);
  return { nodes, edges };
};

const FlowTree: React.FC = () => {
  const { nodes, edges } = astToTree(ast);
  const [newNodes, setNodes] = useState(nodes);
  const [newEdges, setEdges] = useState(edges);
  const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
  const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );
  console.log('ast: ', ast);
  return (
    <ReactFlow 
    nodes={newNodes} 
    edges={edges} 
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    style={{ height: 500, width: '100%', border: '1px solid black' }} >
            <Background />
          <Controls />  
    </ReactFlow>
  );
};


export default FlowTree;
