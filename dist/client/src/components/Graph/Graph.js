"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
function Graph({ responseTimes, selectedQuery, queryTypes, }) {
    let number = 0;
    let dataset = {
        labels: number++,
        datasets: responseTimes,
    };
    // function to display accurate time in tooltip
    const labelChart = 'Response Times';
    const titleTooltip = (tooltipItems) => {
        return labelChart;
    };
    const labelTooltip = (tooltipItem) => {
        if (Array.isArray(tooltipItem)) {
            return tooltipItem.map(() => '');
        }
        const responseTime = responseTimes[tooltipItem.dataIndex];
        return `${responseTime} ms`;
    };
    const options = {
        color: 'white',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 800,
                display: true,
                align: 'center',
                text: 'Response times in ms',
                ticks: {
                    callback: function (value) {
                        return value + ' ms';
                    },
                    color: 'white',
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Fetch Speeds',
                color: 'white'
            },
            tooltip: {
                callbacks: {
                    title: titleTooltip,
                    label: labelTooltip,
                },
            },
        },
    };
    (0, react_1.useEffect)(() => { }, [responseTimes]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "graph h-80 pt-1", children: (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Bar, { options: options, data: {
                labels: [...Array(responseTimes.length + 1).keys()].slice(1),
                datasets: [
                    {
                        label: `Request ${responseTimes.length === 1 ? responseTimes[0] : responseTimes.slice(-1)}ms`,
                        data: responseTimes.map((time) => time < 10 ? 20 : time),
                        backgroundColor: 'rgba(53, 162, 235,0.75)',
                    },
                ],
            } }) }));
}
exports.Graph = Graph;
