import React, { useState, useMemo, useEffect, useCallback } from 'react';

import PinLogin from './components/PinLogin';
import OfficeDashboard from './dashboards/OfficeDashboard';
import GardenDashboard from './dashboards/GardenDashboard';
import StorageDashboard from './dashboards/StorageDashboard';
import DeliveryDashboard from './dashboards/DeliveryDashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import DriverDashboard from './dashboards/DriverDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import RegistryDashboard from './dashboards/RegistryDashboard';
import { generateIotData, initDeviceSources, randomizeDeviceSources } from './data/iotData';

const REFRESH_INTERVAL = 1800000; // 30 minutes
const STORAGE_KEY = 'iot_data_history';

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveHistory(history) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } 
  catch (e) { console.error('Failed to save:', e); }
}

export default function App() {
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(REFRESH_INTERVAL / 1000);

  const currentData = useMemo(() => {
    if (selectedTimestamp) {
      const entry = history.find(h => h.timestamp === selectedTimestamp);
      return entry ? entry.data : [];
    }
    return history.length > 0 ? history[0].data : [];
  }, [history, selectedTimestamp]);

  const lastUpdate = useMemo(() => {
    return history.length > 0 ? new Date(history[0].timestamp) : null;
  }, [history]);

  const refreshData = useCallback(() => {
    setHistory(prev => {
      const previousData = prev.length > 0 ? prev[0].data : null;
      const newData = generateIotData(previousData);
      const timestamp = new Date().toISOString();
      const updated = [{ timestamp, data: newData }, ...prev].slice(0, 336); // 7 days at 30min intervals
      saveHistory(updated);
      return updated;
    });
    setSelectedTimestamp(null);
    setNextUpdate(REFRESH_INTERVAL / 1000);
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    refreshData();
  }, [refreshData]);

  const randomize = useCallback(() => {
    randomizeDeviceSources();
    clearHistory();
  }, [clearHistory]);

  const handleLogout = () => {
    setActiveDashboard(null);
  };

  useEffect(() => {
    if (history.length > 0) initDeviceSources(history[0].data);
    else refreshData();
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshData]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : REFRESH_INTERVAL / 1000));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const dashboardProps = {
    data: currentData,
    history,
    selectedTimestamp,
    onSelectTimestamp: setSelectedTimestamp,
    onRefresh: refreshData,
    onClearHistory: clearHistory,
    onRandomize: randomize,
    onLogout: handleLogout,
    lastUpdate,
    nextUpdate,
    formatCountdown
  };

  // Show PIN numpad if not logged in
  if (!activeDashboard) {
    return <PinLogin onSuccess={setActiveDashboard} />;
  }

  return (
    <div className="app-container no-nav">
      <main className="dashboard-content">
        {activeDashboard === 'office' && <OfficeDashboard {...dashboardProps} />}
        {activeDashboard === 'garden' && <GardenDashboard {...dashboardProps} />}
        {activeDashboard === 'storage' && <StorageDashboard {...dashboardProps} />}
        {activeDashboard === 'delivery' && <DeliveryDashboard {...dashboardProps} />}
        {activeDashboard === 'client' && <ClientDashboard {...dashboardProps} />}
        {activeDashboard === 'driver' && <DriverDashboard {...dashboardProps} />}
        {activeDashboard === 'manager' && <ManagerDashboard {...dashboardProps} />}
        {activeDashboard === 'registry' && <RegistryDashboard {...dashboardProps} />}
      </main>
    </div>
  );
}
