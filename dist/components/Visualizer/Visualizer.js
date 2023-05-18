import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Visualizer.modules.css';
import FlowTree from "./FlowTree";
import FlowTable from "./FlowTable";
export function Visualizer({ query }) {
    return (_jsxs("div", Object.assign({ className: styles.graphContainer }, { children: [_jsx("h2", { children: "Execution Tree" }), _jsx("div", Object.assign({ className: styles.flowTree }, { children: _jsx(FlowTree, { query: query }) })), _jsx("h2", { children: " Execution Table " }), _jsx("div", Object.assign({ className: styles.flowTable }, { children: _jsx(FlowTable, { query: query }) }))] })));
}
