import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Editors.modules.css';
import ControlledEditor from '@monaco-editor/react';
import { querySamples } from '../helperFunctions';
export const QueryEditor = ({ setQuery, selectedQuery }) => {
    const handleChange = (value, ev) => {
        setQuery(value);
    };
    const query = querySamples[selectedQuery];
    return (_jsx("div", Object.assign({ className: styles.container }, { children: _jsx(ControlledEditor, { className: styles.editor, defaultLanguage: "graphql", value: query, onChange: handleChange, options: {
                scrollBeyondLastLine: true,
                wordWrap: 'wordWrapColumn',
            } }) })));
};
export const ResponseEditor = ({ response }) => {
    return (_jsx("div", Object.assign({ className: styles.container }, { children: _jsx(ControlledEditor, { className: styles.editor, defaultLanguage: "graphql", value: response, 
            // onChange={null}
            options: {
                scrollBeyondLastLine: true,
            } }) })));
};
