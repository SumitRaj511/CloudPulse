import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import CircularProgress from '../components/CircularProgress';
import { overviewStats, servers, alerts, logs, cpuHistory, networkHistory } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{entry.name}:</span>
            <span className="tooltip-value">{entry.value}{entry.name.includes('Network') ? ' MB/s' : '%'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon, label, value, sub, color, onClick }) => (
  <div
    className="metric-card fade-in"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div className="metric-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="metric-value" style={{ color }}>{value}</div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
    {sub && (
      <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '10px',
        fontWeight: 300,
        lineHeight: 1.5,
      }}>
        {sub}
      </div>
    )}
  </div>
);

// SVG icon components
const ServerIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="6" cy="18" r="1" fill="currentColor" stroke="none"/></svg>;
const BoxIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const BellIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const CpuIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;

const DashboardPage = ({ onNavigate }) => {
  const [liveData, setLiveData] = useState(cpuHistory);
  const [networkData, setNetworkData] = useState(networkHistory);
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const recentLogs = logs.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      setLiveData(prev => {
        const newPoint = {
          time: timeStr,
          cpu:    Math.max(5,  Math.min(95, (prev[prev.length-1]?.cpu    || 50) + (Math.random()-0.4)*8)),
          memory: Math.max(30, Math.min(95, (prev[prev.length-1]?.memory || 65) + (Math.random()-0.4)*4)),
          disk:   Math.max(30, Math.min(99, (prev[prev.length-1]?.disk   || 70) + (Math.random()-0.4)*1)),
        };
        return [...prev.slice(-29), newPoint];
      });
      setNetworkData(prev => {
        const newPoint = {
          time: timeStr,
          inbound:  Math.round(Math.max(2,  Math.min(100,(prev[prev.length-1]?.inbound  || 30) + (Math.random()-0.4)*15))*10)/10,
          outbound: Math.round(Math.max(1,  Math.min(60, (prev[prev.length-1]?.outbound || 15) + (Math.random()-0.4)*8 ))*10)/10,
        };
        return [...prev.slice(-29), newPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentStats = liveData[liveData.length - 1] || { cpu: 42, memory: 67, disk: 72 };

  return (
    <div className="page-content">
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <StatCard
          icon={<ServerIcon />}
          label="Total Servers"
          value={overviewStats.totalServers}
          sub={`${overviewStats.onlineServers} online · ${overviewStats.warningServers} warning · ${overviewStats.offlineServers} offline`}
          color="var(--accent-indigo-light)"
          onClick={() => onNavigate('servers')}
        />
        <StatCard
          icon={<BoxIcon />}
          label="Containers"
          value={overviewStats.totalContainers}
          sub={`${overviewStats.runningContainers} running · ${overviewStats.totalContainers - overviewStats.runningContainers} stopped`}
          color="var(--accent-cyan)"
          onClick={() => onNavigate('docker')}
        />
        <StatCard
          icon={<BellIcon />}
          label="Active Alerts"
          value={overviewStats.activeAlerts}
          sub="2 critical · 1 warning unacknowledged"
          color="var(--accent-red)"
          onClick={() => onNavigate('alerts')}
        />
        <StatCard
          icon={<CpuIcon />}
          label="Avg CPU"
          value={`${Math.round(currentStats.cpu)}%`}
          sub={`Memory: ${Math.round(currentStats.memory)}% · Disk: ${Math.round(currentStats.disk)}%`}
          color="var(--accent-green)"
        />
      </div>

      {/* Chart + Circular gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '14px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Resource Usage</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '3px', fontWeight: 300 }}>
                Live — updates every 3s
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              {[['CPU', '#5b5fc7'], ['Memory', '#62e0f5'], ['Disk', '#4dd9a0']].map(([name, color]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                  {name}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={liveData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#5b5fc7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5b5fc7" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#62e0f5" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#62e0f5" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradDisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4dd9a0" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4dd9a0" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu"    name="CPU"    stroke="#5b5fc7" fill="url(#gradCpu)"  strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="memory" name="Memory" stroke="#62e0f5" fill="url(#gradMem)"  strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="disk"   name="Disk"   stroke="#4dd9a0" fill="url(#gradDisk)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Circular Gauges */}
        <div className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>Current Load</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <CircularProgress value={Math.round(currentStats.cpu)}    size={84} label="CPU"    color="#5b5fc7" />
            <CircularProgress value={Math.round(currentStats.memory)} size={84} label="Memory" color="#62e0f5" />
            <CircularProgress value={Math.round(currentStats.disk)}   size={84} label="Disk"   color="#4dd9a0" />
          </div>
        </div>
      </div>

      {/* Network + Servers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        {/* Network Chart */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header">
            <div className="card-title">Network I/O</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[['Inbound', '#62e0f5'], ['Outbound', '#b07cfa']].map(([name, color]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                  {name}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={networkData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="inbound"  name="Inbound Network"  stroke="#62e0f5" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="outbound" name="Outbound Network" stroke="#b07cfa" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Server Fleet */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header">
            <div className="card-title">Server Fleet</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('servers')}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {servers.slice(0, 5).map(server => (
              <div key={server.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                transition: 'var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-glass)'; }}
              >
                <span className={`status-dot ${server.status}`} />
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 400, color: 'var(--text-primary)' }}>{server.name}</span>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                  <span style={{ color: server.cpu > 80 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    {server.cpu}%
                  </span>
                  <span style={{ color: server.memory > 80 ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                    {server.memory}%
                  </span>
                </div>
                <span className={`badge ${server.status === 'online' ? 'badge-green' : server.status === 'warning' ? 'badge-yellow' : 'badge-red'}`}>
                  {server.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Active Alerts */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header">
            <div className="card-title">Active Alerts</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('alerts')}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.level}`}>
                <div className="alert-icon" style={{
                  background: alert.level === 'critical'
                    ? 'rgba(240,92,122,0.12)'
                    : alert.level === 'warning'
                    ? 'rgba(240,136,92,0.12)'
                    : 'rgba(77,159,255,0.12)',
                  color: alert.level === 'critical'
                    ? 'var(--accent-red)'
                    : alert.level === 'warning'
                    ? 'var(--accent-orange)'
                    : 'var(--accent-blue)',
                }}>
                  {alert.level === 'critical' ? '!' : alert.level === 'warning' ? '⚠' : 'i'}
                </div>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-desc">{alert.description}</div>
                </div>
                <div className="alert-time">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header">
            <div className="card-title">Recent Logs</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('logs')}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {recentLogs.map(log => (
              <div key={log.id} className="log-line" style={{ gridTemplateColumns: '110px 56px 1fr' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                  {log.timestamp.split(' ')[1]}
                </span>
                <span className={`log-level ${log.level}`}>{log.level}</span>
                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 300 }}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
