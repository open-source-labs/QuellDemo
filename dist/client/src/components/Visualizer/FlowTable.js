import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { parse } from 'graphql';
import MonacoEditor from '@monaco-editor/react';
// The FC stands for Function Component
const FlowTable = ({ query }) => {
    const [queryOperations, setQueryOperations] = useState([]);
    const editorRef = useRef(null);
    useEffect(() => {
        const operation = parseQuery(query);
        if (operation) {
            const operationOrder = generateOperationOrder(operation);
            setQueryOperations(operationOrder);
        }
    }, [query]);
    // parses the query
    const parseQuery = (query) => {
        const ast = parse(query);
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
        operation.selections.forEach((selection) => {
            if ('name' in selection) {
                const fieldName = parentName ? `${parentName}.${selection.name.value}` : selection.name.value;
                operationOrder.push(fieldName);
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
    const handleEditorChange = (value, event) => {
        // do nothing since we want the editor to be read-only
    };
    return (_jsx("div", { children: _jsx(MonacoEditor, { value: queryOperations.join('\n'), language: "graphql", height: 200, options: {
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
export default FlowTable;
