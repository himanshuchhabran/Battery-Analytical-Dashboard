import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AlertTriangle, Thermometer, Battery, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import TempChart from './TempChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ cycles = [], imei }) => {
  // 1. Safety Check
  if (!cycles || cycles.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Activity className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p>No cycle data available for IMEI: {imei}</p>
      </div>
    );
  }

  // 2. Data Preparation
  const sortedCycles = useMemo(() => {
    return [...cycles].sort((a, b) => a.cycle_number - b.cycle_number);
  }, [cycles]);

  // 3. Navigation State
  const [selectedIndex, setSelectedIndex] = useState(() => Math.max(0, sortedCycles.length - 1));

  useEffect(() => {
    // reset to last index whenever the list length changes
    setSelectedIndex(Math.max(0, sortedCycles.length - 1));
  }, [sortedCycles.length]);

  // Defensive: ensure selectedIndex is in bounds
  const safeIndex = Math.max(0, Math.min(selectedIndex, sortedCycles.length - 1));
  const currentCycle = sortedCycles[safeIndex] || {};

  const handleCycleChange = (e) => {
    setSelectedIndex(Number(e.target.value));
  };

  const warningsCount = (currentCycle.alert_details?.warnings?.length ?? 0);
  const protectionsCount = (currentCycle.alert_details?.protections?.length ?? 0);

  const lineChartData = {
    labels: sortedCycles.map(c => c.cycle_number),
    datasets: [
      {
        label: 'SOH Drop',
        data: sortedCycles.map(c => c.soh_drop),
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        tension: 0.1,
        pointRadius: 0,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
        x: {
            grid: {
                display: false,
            }
        },
        y: {
            grid: {
                borderDash: [3, 3],
                color: '#eee',
            }
        }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Battery Diagnostics</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>IMEI: {imei}</span>
                <span>•</span>
                <span>Date: {currentCycle.timestamp ? new Date(currentCycle.timestamp).toLocaleDateString() : 'N/A'}</span>
            </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
          <button 
            disabled={safeIndex === 0}
            onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <input 
            type="range" 
            min={0} 
            max={sortedCycles.length - 1}
            value={safeIndex}
            onChange={handleCycleChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <button 
            disabled={safeIndex === sortedCycles.length - 1}
            onClick={() => setSelectedIndex(prev => Math.min(sortedCycles.length - 1, prev + 1))}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-xs text-gray-400">Cycle ID</span>
            <span className="font-mono font-bold text-blue-700 text-lg">
                #{currentCycle.cycle_number ?? '--'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Battery />} label="Avg SOC" value={`${(currentCycle.average_soc ?? '--') === '--' ? '--' : (Number(currentCycle.average_soc).toFixed(1))}%`} />
        <StatCard icon={<Activity />} label="SOH Drop" value={`${currentCycle.soh_drop ?? 0}%`} color="text-red-500" />
        <StatCard icon={<Thermometer />} label="Avg Temp" value={`${currentCycle.average_temperature ?? '--'}°C`} />
        <StatCard icon={<AlertTriangle />} label="Alerts" value={warningsCount + protectionsCount} />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TEMP CHART */}
        <div className="bg-white p-4 rounded-lg shadow" style={{ height: '400px', minHeight: '320px' }}>
            <TempChart cycleData={currentCycle} />
        </div>

        {/* VOLTAGE SPECTRUM */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between" style={{ height: '400px', minHeight: '320px' }}>
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity size={18} className="text-blue-500"/> Voltage Spectrum
            </h3>
            <div className="relative pt-6 pb-2">
                <div className="h-4 bg-gray-200 rounded-full w-full overflow-hidden flex">
                    <div style={{width: '20%'}} className="bg-gray-300"></div>
                    <div style={{width: '60%'}} className="bg-green-400"></div>
                    <div style={{width: '20%'}} className="bg-gray-300"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>Min</span>
                    <span>Avg</span>
                    <span>Max</span>
                </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <VoltageRow label="Max Cell Voltage" value={currentCycle.voltage_max} color="text-red-600" />
            <div className="h-px bg-gray-100" />
            <VoltageRow label="Avg Cell Voltage" value={currentCycle.voltage_avg} color="text-blue-600" />
            <div className="h-px bg-gray-100" />
            <VoltageRow label="Min Cell Voltage" value={currentCycle.voltage_min} color="text-orange-600" />
          </div>
        </div>
      </div>

      {/* LONG TERM TRENDS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">SOH Degradation Trend</h3>
        <div style={{ position: 'relative', width: '100%', height: '300px', minHeight: '260px' }}>
          <Line options={lineChartOptions} data={lineChartData} />
        </div>
      </div>

      {/* ALERTS */}
      {(warningsCount > 0 || protectionsCount > 0) && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-red-700 font-bold flex items-center gap-2 mb-3">
            <AlertTriangle size={20} /> Critical Safety Events
          </h3>
          <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">
             {(currentCycle.alert_details?.warnings || []).map((w, i) => <li key={`w-${i}`}>Warning: {w}</li>)}
             {(currentCycle.alert_details?.protections || []).map((p, i) => <li key={`p-${i}`}>Protection: {p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color = "text-gray-900" }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

const VoltageRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${color}`}>{value ?? '--'}</span>
            <span className="text-xs text-gray-400">V</span>
        </div>
    </div>
);

export default Dashboard;
