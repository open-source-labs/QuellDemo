import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './HitMiss.modules.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
export function HitMiss({ cacheMiss, cacheHit }) {
    const data = {
        labels: ['Cache Hit', 'Cache Miss'],
        datasets: [
            {
                label: 'Hit or Miss',
                data: [cacheHit, cacheMiss],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };
    return (_jsxs("div", Object.assign({ className: styles.container }, { children: [_jsx("h3", { children: "Cache Hit vs. Cache Miss" }), _jsx(Doughnut, { data: data })] })));
}
