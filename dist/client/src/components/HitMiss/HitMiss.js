"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitMiss = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
// Register necessary components with ChartJS
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend);
// Component that displays a doughnut chart of cache hit vs cache miss
function HitMiss({ cacheMiss, cacheHit }) {
    const data = {
        labels: ['Cache Hit', 'Cache Miss'],
        datasets: [
            {
                label: 'Hit or Miss',
                data: [cacheHit, cacheMiss],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            },
        ],
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center h-[30%] w-[90%] p-2 m-2 gap-2 text-white font-sans", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Cache Hit vs. Cache Miss" }), (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Doughnut, { data: data })] }));
}
exports.HitMiss = HitMiss;
