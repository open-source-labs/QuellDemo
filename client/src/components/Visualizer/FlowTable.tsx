import React, { useState, useEffect, useRef } from 'react';
import { parse, DocumentNode, SelectionSetNode, OperationDefinitionNode } from 'graphql';
import MonacoEditor from '@monaco-editor/react';
import styles from './Visualizer.modules.css';
import { editor } from 'monaco-editor';

// Defining the expected type
interface Props {
  query: string; // GraphQL query string
  elapsed: { [key: string]: number }; // Object containing elapsed time for each query operation
}

// The FC stands for Function Component
const FlowTable: React.FC<Props> = ({ query, elapsed }) => {
  const [queryOperations, setQueryOperations] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState<{ [key: string]: number }>(elapsed);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Set elapsed time when it changes
  useEffect(() => {
    setElapsedTime(elapsed);
  }, [query, elapsed]);
  
  // The useEffect parse the query and generate the operation order
  useEffect(() => {
    const operation = parseQuery(query);
      setElapsedTime(elapsed);
      const operationOrder = generateOperationOrder(operation);
      setQueryOperations(operationOrder);
  }, [elapsedTime]);

  // Parses the query and returns the SelectionSetNode or OperationDefinitionNode
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

  // Function that takes the query and returns an array of operations in order of the query
  const generateOperationOrder = (operation: SelectionSetNode | OperationDefinitionNode | undefined, parentName = ''): string[] => {
    const operationOrder: string[] = [];
    if (!operation) {
      return operationOrder;
    }
    // Iterate over the selection in the operation
    if (operation.kind === 'OperationDefinition') {
      const selectionSet = operation.selectionSet;
      if (selectionSet) {
        const nestedSelections = generateOperationOrder(selectionSet, parentName);
        operationOrder.push(...nestedSelections);
      }
      return operationOrder;
    }

    operation.selections.forEach((selection) => {
    if (selection.kind === 'Field' && 'name' in selection) {
      let fieldName = parentName ? `${parentName}.${selection.name.value}` : selection.name.value;
      if (elapsedTime[selection.name.value] && operationOrder.length > 1) {
        const newName = fieldName + ` [resolved in ${elapsedTime[selection.name.value]}ms]`;
        operationOrder.push(newName);
      } else {
        operationOrder.push(fieldName);
      }
      // Recursively generate the operation order for nested selections
      if (selection.selectionSet) {
        const nestedSelections = generateOperationOrder(selection.selectionSet, fieldName);
        operationOrder.push(...nestedSelections);
      }
    }
  });
  return operationOrder;
};

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
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