import styles from './Editors.modules.css';
import * as React from 'react';
import ControlledEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { querySamples } from '../helperFunctions';

export const QueryEditor = ({ setQuery, selectedQuery }: QueryEditorProps) => {
  const handleChange = (
    value?: string | undefined,
    ev?: editor.IModelContentChangedEvent
  ): any => {
    setQuery(value || '');
  };

  const query = querySamples[selectedQuery];

  return (
    <div className="h-64 p-5 rounded-xl overflow-hidden">
      <ControlledEditor
        // className={styles.editor}
        defaultLanguage="graphql"
        value={query}
        onChange={handleChange}
        options={{
          scrollBeyondLastLine: true,
          wordWrap: 'wordWrapColumn',
        }}
      />
    </div>
  );
};

// export const ResponseEditor = ({ response }: ResponseEditorProps) => {
//   return (
//     <div className="h-20 border-1 border-white p-5 overflow-scroll">
//       <ControlledEditor
//         className="overflow-scroll"
//         defaultLanguage="graphql"
//         value={response}
//         // onChange={null}
//         options={{
//           scrollBeyondLastLine: true,
//         }}
//       />
//     </div>
//   );
// };

interface QueryEditorProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedQuery: string;
}

interface ResponseEditorProps {
  response: string;
}
