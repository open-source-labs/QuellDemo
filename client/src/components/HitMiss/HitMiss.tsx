import styles from './HitMiss.modules.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register necessary components with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

// Interface for the props of the HitMiss component
interface HitMissProps {
  cacheHit: number; // Number of cache hits
  cacheMiss: number; // Number of cache misses
}

// Component that displays a doughnut chart of cache hit vs cache miss
export function HitMiss({ cacheMiss, cacheHit }: HitMissProps) {
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
  return (
    <div className="flex flex-col items-center h-[30%] w-[90%] p-2 m-2 gap-2 text-white font-sans">
      <h3>Cache Hit vs. Cache Miss</h3>
      <Doughnut data={data} />
    </div>
  );
}