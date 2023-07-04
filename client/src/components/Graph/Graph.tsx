import styles from './Graph.modules.css';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TooltipItem
} from 'chart.js';

// Interface for the props of the Graph component
interface GraphProps {
  responseTimes: any[]; // Array of response times
  selectedQuery: string; // Currently selected query
  queryTypes: any[]; // Array of query types
}

// Register necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Component that displays a bar graph of response times
export function Graph({ responseTimes, selectedQuery, queryTypes }: GraphProps) {
  let number = 0;
  let dataset = {
    labels: number++,
    datasets: responseTimes,
  };

  // Variable to store the label for the chart in the tooltip
  const labelChart: string = 'Response Times';

  // Callback function for the title of the tooltip
  const titleTooltip = (tooltipItems: TooltipItem<'bar'>[]): string => {
    return labelChart;
  };

  // Callback function for the label of the tooltip
  const labelTooltip = (tooltipItem: TooltipItem<'bar'>): string | string[] => {
    if (Array.isArray(tooltipItem)) return tooltipItem.map(() => '');
    const responseTime: number = responseTimes[tooltipItem.dataIndex];
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
          callback: function (value: number | string) {
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

  // Empty effect that is triggered when the 'responseTimes' dependency changes
  useEffect(() => {}, [responseTimes]);

  return (
    <div className="graph h-80 pt-1">
      <Bar
        options={options}
        data={{
          labels: [...Array(responseTimes.length + 1).keys()].slice(1),
          datasets: [
            {
              label: `Request ${responseTimes.length === 1 ? responseTimes[0] : responseTimes.slice(-1)}ms`,
              data: responseTimes.map((time: number) => time < 10 ? 20 : time),
              backgroundColor: 'rgba(53, 162, 235,0.75)',
            },
          ],
        }}
      />
    </div>
  );
}
