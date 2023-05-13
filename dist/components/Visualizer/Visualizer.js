import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Visualizer.modules.css';
import FlowTree from "./FlowTree";
export function Visualizer({ query }) {
    return (_jsxs("div", Object.assign({ className: styles.graphContainer }, { children: [_jsx("h1", { children: "Execution Tree" }), _jsx(FlowTree, { query: query })] })));
}
