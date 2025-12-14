import React, { useState, useEffect } from 'react';
import { fetchSnapshots, ALLOWED_IMEIS } from './services/api';
import Dashboard from './components/Dashboard';

function App() {
  const [selectedImei, setSelectedImei] = useState(ALLOWED_IMEIS[0]);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchSnapshots(selectedImei);
       
        setCycles(response.data || []); 
        
      } catch (err) {
        console.error("Failed to fetch cycles", err);
        setCycles([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedImei]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Zenfinity Battery Analytics</h1>
        <select 
          className="p-2 border rounded-md"
          value={selectedImei}
          onChange={(e) => setSelectedImei(e.target.value)}
        >
          {ALLOWED_IMEIS.map(imei => (
            <option key={imei} value={imei}>{imei}</option>
          ))}
        </select>
      </header>
      
      {loading ? <p>Loading Data...</p> : <Dashboard cycles={cycles} imei={selectedImei} />}
    </div>
  );
}

export default App;