import axios from 'axios';
  
const BASE_URL = 'https://zenfinity-intern-api-104290304048.europe-west1.run.app/api';

export const ALLOWED_IMEIS = ['865044073967657', '865044073949366'];

export const fetchSummary = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/snapshots/summary`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return null;
  }
};

export const fetchSnapshots = async (imei, limit = 100) => {
  try {
    const response = await axios.get(`${BASE_URL}/snapshots`, {
      params: { imei, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch snapshots:", error);
    return [];
  }
};

export const fetchCycleDetails = async (imei, cycleNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/snapshots/${imei}/cycles/${cycleNumber}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cycle details:", error);
    return null;
  }
};