import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Graph.modules.css';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export function Graph({ responseTimes, selectedQuery, queryTypes, }) {
    let number = 0;
    let dataset = {
        labels: number++,
        datasets: responseTimes,
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 750,
                display: true,
                align: 'center',
                text: 'Response times in ms',
                ticks: {
                    callback: function (value) {
                        return value + ' ms';
                    },
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Fetch Speeds',
            },
        },
    };
    useEffect(() => { }, [responseTimes]);
    return (_jsx("div", Object.assign({ className: styles.container }, { children: _jsx(Bar, { options: options, data: {
                labels: [...Array(responseTimes.length + 1).keys()].slice(1),
                datasets: [
                    {
                        label: 'Request',
                        data: responseTimes,
                        backgroundColor: 'rgba(53, 162, 235,0.75)',
                    },
                ],
            } }) })));
}
