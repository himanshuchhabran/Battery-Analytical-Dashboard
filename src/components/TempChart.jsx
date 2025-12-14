import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TempChart = ({ cycleData }) => {
  const [resolution, setResolution] = useState('5deg');

  const getChartData = () => {
    const key = `temperature_dist_${resolution}`;
    const rawData = cycleData?.[key] || {};

    const sortedData = Object.entries(rawData)
      .map(([range, minutes]) => ({ range, minutes }))
      .sort((a, b) => {
        const parseStart = (r) => {
          const m = String(r).match(/-?\d+/);
          return m ? parseInt(m[0], 10) : Number(r) || 0;
        };
        const startA = parseStart(a.range);
        const startB = parseStart(b.range);
        return startA - startB;
      });
    
    return {
        labels: sortedData.map(d => d.range),
        datasets: [
            {
                label: 'Time (min)',
                data: sortedData.map(d => d.minutes),
                backgroundColor: '#6366f1',
                borderRadius: 4,
            }
        ]
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Time (min): ${context.raw}`;
          }
        }
      }
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 12,
                }
            }
        },
        y: {
            grid: {
                borderDash: [3, 3],
                color: '#eee',
            },
            title: {
                display: true,
                text: 'Minutes',
            }
        }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Temperature Distribution</h3>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="text-sm border rounded p-1"
        >
          <option value="5deg">5°C Buckets</option>
          <option value="10deg">10°C Buckets</option>
          <option value="15deg">15°C Buckets</option>
          <option value="20deg">20°C Buckets</option>
        </select>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Bar options={options} data={getChartData()} />
      </div>
    </div>
  );
};

export default TempChart;
