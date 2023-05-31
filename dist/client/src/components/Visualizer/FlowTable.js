"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const graphql_1 = require("graphql");
const react_2 = __importDefault(require("@monaco-editor/react"));
// The FC stands for Function Component
const FlowTable = ({ query }) => {
    const [queryOperations, setQueryOperations] = (0, react_1.useState)([]);
    const editorRef = (0, react_1.useRef)(null);
    // The useEffect parse the query and generate the operation order
    (0, react_1.useEffect)(() => {
        const operation = parseQuery(query);
        if (operation) {
            const operationOrder = generateOperationOrder(operation);
            setQueryOperations(operationOrder);
        }
    }, [query]);
    // parses the query
    const parseQuery = (query) => {
        const ast = (0, graphql_1.parse)(query);
        if (ast.definitions.length === 1) {
            const definition = ast.definitions[0];
            if (definition.kind === 'OperationDefinition') {
                return definition.selectionSet;
            }
            else if (definition.kind === 'FragmentDefinition') {
                return definition.selectionSet;
            }
        }
        return undefined;
    };
    // function that takes the query and returns an array of operations in order of the query
    const generateOperationOrder = (operation, parentName = '') => {
        const operationOrder = [];
        if (!operation) {
            return operationOrder;
        }
        // Iterate over the selection in the operation
        operation.selections.forEach((selection) => {
            if ('name' in selection) {
                const fieldName = parentName ? `${parentName}.${selection.name.value}` : selection.name.value;
                operationOrder.push(fieldName);
                // Recursively generate the operation order for nested selection
                if ('selectionSet' in selection) {
                    const nestedSelections = generateOperationOrder(selection.selectionSet, fieldName);
                    operationOrder.push(...nestedSelections);
                }
            }
        });
        return operationOrder;
    };
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_2.default, { value: queryOperations.join('\n'), language: "graphql", height: 200, options: {
                readOnly: true,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                autoIndent: 'keep',
                formatOnPaste: true,
                formatOnType: true,
                minimap: {
                    enabled: false,
                },
                lineNumbers: 'on',
            } }) }));
};
exports.default = FlowTable;
