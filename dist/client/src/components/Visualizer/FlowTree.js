"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const reactflow_1 = __importStar(require("reactflow"));
const graphql_1 = require("graphql");
// Converts the AST node to a ReactFlow NodeData
const getNode = (node, depth, siblingIndex, numSiblings, numNodes, parentPosition) => {
    var _a, _b;
    const label = node.kind === 'Field' ? node.name.value : node.kind;
    const id = `${(_a = node.loc) === null || _a === void 0 ? void 0 : _a.start}-${(_b = node.loc) === null || _b === void 0 ? void 0 : _b.end}`;
    const parentX = parentPosition ? parentPosition.x : 0;
    const x = ((siblingIndex + 0.3) / 3) * 400 + 230;
    return {
        id: id,
        data: { label },
        position: {
            y: 100 + depth * 100,
            x: parentX + x - (numSiblings / 2) * 290,
        },
        style: {
            width: 125,
            height: 30,
            fontSize: 18,
            border: `none`,
            borderRadius: 12,
            boxShadow: `0px 0px 3px #11262C`,
            padding: `2px 0px 0px 0px`
        }
    };
};
// Gets edge connection between parent and child nodes (edge is the thing that visually connects the parent/child node together)
const getEdge = (parent, child, elapsed) => {
    var _a, _b, _c, _d;
    const parentId = `${(_a = parent.loc) === null || _a === void 0 ? void 0 : _a.start}-${(_b = parent.loc) === null || _b === void 0 ? void 0 : _b.end}`;
    const childId = `${(_c = child.loc) === null || _c === void 0 ? void 0 : _c.start}-${(_d = child.loc) === null || _d === void 0 ? void 0 : _d.end}`;
    const edgeProps = {
        id: `${parentId}-${childId}`,
        source: parentId,
        target: childId,
        animated: false,
        markerEnd: {
            type: reactflow_1.MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: '#03C6FF'
        },
        style: {
            strokeWidth: 2,
            stroke: '#03C6FF'
        },
        labelStyle: {
            fontSize: 14,
        },
        labelBgBorderRadius: 10,
    };
    const childNode = child;
    if (elapsed[childNode.name.value]) {
        edgeProps.label = `${elapsed[childNode.name.value]}ms`;
    }
    return edgeProps;
};
// Recursively constructs a tree structure from GraphQL AST
const buildTree = (node, nodes, edges, elapsed, depth = 0, siblingIndex = 0, numSiblings = 1, parentPosition) => {
    // Gets the parent node and pushes it into the nodes array
    const parent = getNode(node, depth, siblingIndex, numSiblings, numSiblings, parentPosition);
    nodes.push(parent);
    // If the node has child nodes (selectionSet), iterate over them
    if (node.kind === 'Field' && node.selectionSet) {
        const numChildren = node.selectionSet.selections.length;
        // forEach childNode it will call getNode
        node.selectionSet.selections.forEach((childNode, i) => {
            const child = getNode(childNode, depth + 1, i, numChildren, numSiblings, parent.position);
            // Pushes the child node and edge into the respective arrays
            edges.push(getEdge(node, childNode, elapsed));
            buildTree(childNode, nodes, edges, elapsed, depth + 1, i, numChildren, parent.position);
        });
    }
};
// Takes the AST and returns nodes and edges as arrays for ReactFlow to render
const astToTree = (query, elapsed) => {
    const ast = (0, graphql_1.parse)(query);
    const operation = ast.definitions.find((def) => def.kind === 'OperationDefinition' && def.selectionSet);
    if (!operation) {
        throw new Error('No operation definition found in query');
    }
    const selections = operation.selectionSet.selections;
    const nodes = [];
    const edges = [];
    let currentX = 0; // Adjust the initial x position for the first tree
    let currentY = 0; // Adjust the initial y position for the first tree
    selections.forEach((selection, index) => {
        const numSiblings = selections.length;
        const siblingIndex = index;
        const x = ((siblingIndex + 0.5) / numSiblings) * 900 + currentX;
        const y = 100 + currentY;
        buildTree(selection, nodes, edges, elapsed, 0, siblingIndex, numSiblings, { x, y });
    });
    return { nodes, edges };
};
// Renders a tree graph from GraphQL AST
const FlowTree = ({ query, elapsed }) => {
    const [currentQuery, setCurrentQuery] = (0, react_1.useState)(query);
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(elapsed);
    // Update the state of nodes and edges when query changes
    (0, react_1.useEffect)(() => {
        // When the query or elapsed time changes, convert the AST to nodes and edges
        const { nodes: newNodes, edges: newEdges } = astToTree(query, elapsedTime);
        const nodes = newNodes.map(node => {
            if (!node.position) {
                throw new Error(`Node with id ${node.id} does not have a position`);
            }
            return {
                id: node.id,
                data: node.data,
                position: node.position,
                style: node.style
            };
        });
        // Update the state with the new nodes and edges
        setNodes(nodes);
        setEdges(newEdges);
        setCurrentQuery(query);
        setElapsedTime(elapsed);
    }, [query, currentQuery, elapsed, elapsedTime]);
    // Storing the initial values of the nodes and edges
    const [newNodes, setNodes] = (0, react_1.useState)([]);
    const [newEdges, setEdges] = (0, react_1.useState)([]);
    // setNodes/setEdges updates the state of the component causing it to re-render
    const onNodesChange = (0, react_1.useCallback)((changes) => setNodes((nds) => (0, reactflow_1.applyNodeChanges)(changes, nds)), []);
    const onEdgesChange = (0, react_1.useCallback)((changes) => setEdges((eds) => (0, reactflow_1.applyEdgeChanges)(changes, eds)), []);
    // This is to remove the reactflow watermark
    const proOptions = { hideAttribution: true };
    return ((0, jsx_runtime_1.jsxs)(reactflow_1.default, { nodes: newNodes, edges: newEdges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, fitView: true, proOptions: proOptions, children: [(0, jsx_runtime_1.jsx)(reactflow_1.Background, {}), (0, jsx_runtime_1.jsx)(reactflow_1.Controls, {}), (0, jsx_runtime_1.jsx)(reactflow_1.MiniMap, { style: { height: 75, width: 75 } })] }));
};
exports.default = FlowTree;
