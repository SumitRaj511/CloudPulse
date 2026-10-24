import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import DockerPage from './pages/DockerPage';
import AlertsPage from './pages/AlertsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const AppContent = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  // Update page title
  useEffect(() => {
    const titles = {
      dashboard: 'Dashboard',
      servers: 'Servers',
      docker: 'Docker',
      alerts: 'Alerts',
      logs: 'Logs',
      settings: 'Settings',
    };
    document.title = `CloudOps Monitor – ${titles[activePage] || 'Dashboard'}`;
  }, [activePage]);

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={setActivePage} />;
      case 'servers':   return <ServersPage />;
      case 'docker':    return <DockerPage />;
      case 'alerts':    return <AlertsPage />;
      case 'logs':      return <LogsPage />;
      case 'settings':  return user.role === 'admin' ? <SettingsPage /> : <DashboardPage onNavigate={setActivePage} />;
      default:          return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <Header activePage={activePage} onNavigate={setActivePage} alertCount={3} />
        {renderPage()}
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
