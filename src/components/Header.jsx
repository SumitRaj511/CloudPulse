import React, { useState, useEffect } from 'react';

const pageTitles = {
  dashboard: { title: 'Overview',  subtitle: 'Real-time infrastructure metrics' },
  servers:   { title: 'Servers',   subtitle: 'Fleet health and resource management' },
  docker:    { title: 'Containers', subtitle: 'Docker runtime and image registry' },
  alerts:    { title: 'Alerts',    subtitle: 'Incidents, thresholds, and notifications' },
  logs:      { title: 'Logs',      subtitle: 'System and application event stream' },
  settings:  { title: 'Settings',  subtitle: 'Configuration and preferences' },
};

const Header = ({ activePage, onNavigate, alertCount = 3 }) => {
  const { title, subtitle } = pageTitles[activePage] || pageTitles.dashboard;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <div className="header-subtitle">{subtitle}</div>
      </div>

      <div className="header-right">
        {/* Live Clock */}
        <div style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '5px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 400,
            fontFamily: 'DM Mono, monospace',
            color: 'var(--accent-indigo-light)',
            letterSpacing: '0.03em',
          }}>
            {timeStr}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{dateStr}</span>
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Search..." id="header-search" />
        </div>

        {/* Alerts Bell */}
        <button
          id="header-alerts-btn"
          className="notification-btn"
          onClick={() => onNavigate('alerts')}
          title="View Alerts"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {alertCount > 0 && (
            <span className="notification-badge">{alertCount}</span>
          )}
        </button>

        {/* Refresh */}
        <button
          id="header-refresh-btn"
          className="btn btn-secondary btn-icon"
          title="Refresh"
          onClick={() => window.location.reload()}
          style={{ fontSize: '16px', color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
