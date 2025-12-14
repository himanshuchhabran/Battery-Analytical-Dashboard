import axios from 'axios';

// CHANGE THIS: Use the relative path so the request goes through the Vite proxy
const BASE_URL = '/api'; 

export const ALLOWED_IMEIS = ['865044073967657', '865044073949366'];

export const fetchSummary = async () => {
  // This request now goes to http://localhost:5173/api/snapshots/summary
  // Vite forwards it to the real API.
  const response = await axios.get(`${BASE_URL}/snapshots/summary`);
  return response.data;
};

export const fetchSnapshots = async (imei, limit = 100) => {
  const response = await axios.get(`${BASE_URL}/snapshots`, {
    params: { imei, limit }
  });
  return response.data;
};

export const fetchCycleDetails = async (imei, cycleNumber) => {
  const response = await axios.get(`${BASE_URL}/snapshots/${imei}/cycles/${cycleNumber}`);
  return response.data;
};