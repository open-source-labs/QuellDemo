import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from './components/App';
import { theme } from './themes';
import { ThemeProvider } from '@mui/material';
import 'reactflow/dist/style.css';
let root = ReactDOM.createRoot(document.getElementById('root'));
root.render(_jsx(ThemeProvider, Object.assign({ theme: theme }, { children: _jsx(React.StrictMode, { children: _jsx(App, {}) }) })));
