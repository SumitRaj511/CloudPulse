import React from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard',   section: 'main',       icon: <DashIcon /> },
  { id: 'servers',   label: 'Servers',     section: 'main',       icon: <ServersIcon /> },
  { id: 'docker',    label: 'Containers',  section: 'main',       icon: <DockerIcon /> },
  { id: 'alerts',    label: 'Alerts',      section: 'monitoring', icon: <AlertsIcon />, badge: 3 },
  { id: 'logs',      label: 'Logs',        section: 'monitoring', icon: <LogsIcon /> },
  { id: 'settings',  label: 'Settings',    section: 'config',     icon: <SettingsIcon />, adminOnly: true },
];

function DashIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function ServersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="6" cy="18" r="1.2" fill="currentColor" stroke="none"/></svg>; }
function DockerIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12.5c0 0-1.5-1-4.5-.5s-4 2.5-7 2.5-4.5-2-4.5-2"/><path d="M2 12c0-3.3 2.7-6 6-6h.5"/><rect x="7" y="4" width="3" height="3"/><rect x="11" y="4" width="3" height="3"/><rect x="15" y="4" width="3" height="3"/><rect x="7" y="8" width="3" height="3"/><rect x="11" y="8" width="3" height="3"/></svg>; }
function AlertsIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function LogsIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>; }
function SettingsIcon(){ return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }

const systemStatus = [
  { label: 'API Server', online: true },
  { label: 'Database',   online: true },
  { label: 'Agent',      online: true },
];

const sections = [
  { key: 'main',       label: 'Overview' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'config',     label: 'Config' },
];

const Sidebar = ({ activePage, onNavigate }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          CloudOps
          <span>Monitor v2.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map(section => {
          const sectionItems = navItems.filter(item => {
            if (item.section !== section.key) return false;
            if (item.adminOnly && !isAdmin) return false;
            return true;
          });
          if (sectionItems.length === 0) return null;

          return (
            <div key={section.key}>
              <div className="nav-section-label">{section.label}</div>
              {sectionItems.map(item => (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span style={{ opacity: activePage === item.id ? 1 : 0.6, display: 'flex' }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          );
        })}

        {/* System Status */}
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <div className="nav-section-label">System Status</div>
          <div className="system-status-widget">
            {systemStatus.map(s => (
              <div key={s.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                <span>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className={`status-dot ${s.online ? 'online' : 'offline'}`} />
                  <span style={{
                    fontSize: '10px',
                    color: s.online ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontFamily: 'DM Mono, monospace',
                  }}>
                    {s.online ? 'OK' : 'DOWN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile" onClick={logout} title="Click to logout">
          <div className="user-avatar">{user?.avatar || '?'}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">
              {user?.role === 'admin' ? '· Administrator' : '· Viewer'}
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-dim)', flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
