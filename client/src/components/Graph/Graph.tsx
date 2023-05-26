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
import { title } from 'process';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Graph({
  responseTimes,
  selectedQuery,
  queryTypes,
}: GraphProps) {
  let number = 0;
  let dataset = {
    labels: number++,
    datasets: responseTimes,
  };

  // function to display accurate time in tooltip
  const labelChart: string = 'Response Times';

  const titleTooltip = (tooltipItems: TooltipItem<'bar'>[]): string => {
    return labelChart;
  };

  const labelTooltip = (tooltipItem: TooltipItem<'bar'>): string | string[] => {
    if (Array.isArray(tooltipItem)) {
      return tooltipItem.map(() => '');
    }
    const responseTime = responseTimes[tooltipItem.dataIndex];
    return `${responseTime} ms`;
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
          callback: function (value: number | string) {
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
      tooltip: {
        callbacks: {
          title: titleTooltip,
          label: labelTooltip
        },
      },
    },
  };

  useEffect(() => {}, [responseTimes]);



  
  return (
    <div className="graph h-80 text-white">
      <Bar
        options={options}
        data={{
          labels: [...Array(responseTimes.length + 1).keys()].slice(1),
          datasets: [
            {
              label: `Request ${responseTimes.length === 1 ? responseTimes[0] : responseTimes.slice(-1)}ms`,
              data: responseTimes.map((time) => time < 10 ? 20 : time),
              backgroundColor: 'rgba(53, 162, 235,0.75)',
            },
          ],
        }}
      />
    </div>
  );
}

interface GraphProps {
  responseTimes: any[];
  selectedQuery: string;
  queryTypes: any[];
}
