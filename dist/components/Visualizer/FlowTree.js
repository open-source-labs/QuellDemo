import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges, MiniMap } from 'reactflow';
import { parse } from 'graphql';
// turns ast field to node
const getNode = (node, depth, siblingIndex, numSiblings, numNodes, parentPosition) => {
    var _a, _b;
    const label = node.kind === 'Field' ? node.name.value : node.kind;
    const id = `${(_a = node.loc) === null || _a === void 0 ? void 0 : _a.start}-${(_b = node.loc) === null || _b === void 0 ? void 0 : _b.end}`;
    const parentX = parentPosition ? parentPosition.x : 0;
    const x = ((siblingIndex + 0.5) / numSiblings) * 500 + 100;
    return {
        id: id,
        data: { label },
        position: {
            y: 100 + depth * 100,
            x: parentX + x - (numSiblings / 2) * 275,
        },
        style: { width: 80, height: 40, fontSize: 18, border: `none`, borderRadius: 10, boxShadow: `0px 0px 4px gray` }
    };
};
// gets edge connection between parent/child nodes
// edge is the thing that visually connects the parent/child node together
const getEdge = (parent, child) => {
    var _a, _b, _c, _d;
    const parentId = `${(_a = parent.loc) === null || _a === void 0 ? void 0 : _a.start}-${(_b = parent.loc) === null || _b === void 0 ? void 0 : _b.end}`;
    const childId = `${(_c = child.loc) === null || _c === void 0 ? void 0 : _c.start}-${(_d = child.loc) === null || _d === void 0 ? void 0 : _d.end}`;
    return {
        id: `${parentId}-${childId}`,
        source: parentId,
        target: childId,
        style: {},
    };
};
// recursively constructs a tree structure from GraphQL AST
const buildTree = (node, nodes, edges, depth = 0, siblingIndex = 0, numSiblings = 1, parentPosition) => {
    // gets the parent node and pushes it into the nodes array
    const parent = getNode(node, depth, siblingIndex, numSiblings, numSiblings, parentPosition);
    nodes.push(parent);
    console.log("Parent node: ", parent);
    // the selectionSet means that it has child nodes
    if (node.kind === 'Field' && node.selectionSet) {
        const numChildren = node.selectionSet.selections.length;
        // forEach childNode it will call getNode
        node.selectionSet.selections.forEach((childNode, i) => {
            const child = getNode(childNode, depth + 1, i, numChildren, numSiblings, parent.position);
            //pushes the child node and edge into the respective arrays
            edges.push(getEdge(node, childNode));
            buildTree(childNode, nodes, edges, depth + 1, i, numChildren, parent.position);
        });
    }
};
// takes the ast and returns nodes and edges as arrays for ReactFlow to render
const astToTree = (query) => {
    // parses query to AST
    const ast = parse(query);
    const operation = ast.definitions.find(def => def.kind === 'OperationDefinition' && def.selectionSet);
    if (!operation) {
        throw new Error('No operation definition found in query');
    }
    const selections = operation.selectionSet.selections;
    const nodes = [];
    const edges = [];
    buildTree(selections[0], nodes, edges, 0);
    return { nodes, edges };
};
// render a tree graph from GraphQL AST
const FlowTree = ({ query }) => {
    const [currentQuery, setCurrentQuery] = useState(query);
    // update the state of nodes and edges when query changes
    useEffect(() => {
        // only update if the query is different from the currentQuery
        if (query !== currentQuery) {
            const { nodes: newNodes, edges: newEdges } = astToTree(query);
            setNodes(newNodes);
            setEdges(newEdges);
            setCurrentQuery(query);
        }
    }, [query, currentQuery]);
    // console.log(query);
    const { nodes, edges } = astToTree(query);
    // console.log(nodes);
    // storing the initial values of the nodes and edges
    const [newNodes, setNodes] = useState(nodes);
    const [newEdges, setEdges] = useState(edges);
    // setNodes/setEdges updates the state of the component causing it to re-render
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    // console.log('ast: ', ast);
    const proOptions = { hideAttribution: true };
    return (_jsxs(ReactFlow, Object.assign({ nodes: newNodes, edges: newEdges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, fitView: true, proOptions: proOptions, style: { height: 500, width: '100%', border: '3px solid lightGray', borderRadius: 10 } }, { children: [_jsx(Background, {}), _jsx(Controls, {}), _jsx(MiniMap, { style: { height: 100, width: 100 } })] })));
};
export default FlowTree;
