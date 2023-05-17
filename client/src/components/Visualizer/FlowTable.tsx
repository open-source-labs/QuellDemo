import React, { useState, useEffect, useRef } from 'react';
import { parse, DocumentNode, SelectionSetNode, OperationDefinitionNode } from 'graphql';
import MonacoEditor from '@monaco-editor/react';
import styles from './Visualizer.modules.css';

// defining the expected type
interface Props {
  query: string;
}

// The FC stands for Function Component
const FlowTable: React.FC<Props> = ({ query }) => {
  const [queryOperations, setQueryOperations] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

  // The useEffect parse the query and generate the operation order
  useEffect(() => {
    const operation = parseQuery(query);
    if (operation) {
      const operationOrder = generateOperationOrder(operation);
      setQueryOperations(operationOrder);
    }
  }, [query]);

  // parses the query
  const parseQuery = (query: string): SelectionSetNode | OperationDefinitionNode | undefined => {
    const ast: DocumentNode = parse(query);

    if (ast.definitions.length === 1) {
        const definition = ast.definitions[0];
        if (definition.kind === 'OperationDefinition') {
          return definition.selectionSet;
        } else if (definition.kind === 'FragmentDefinition') {
          return definition.selectionSet;
        }
      }
    
    return undefined;
  };

  // function that takes the query and returns an array of operations in order of the query
  const generateOperationOrder = (operation: SelectionSetNode | OperationDefinitionNode | any, parentName = ''): string[] => {
    const operationOrder: string[] = [];
    if (!operation) {
      return operationOrder;
    }
    // Iterate over the selection in the operation
    operation.selections.forEach((selection: { name: { value: any; }; selectionSet: OperationDefinitionNode | SelectionSetNode; }) => {
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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div>
      <MonacoEditor
        value={queryOperations.join('\n')}
        language="graphql"
        height={200}
        options={{
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
        }}
      />
    </div>
  );
};

export default FlowTable;