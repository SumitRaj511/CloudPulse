import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ToggleSwitch = ({ on, onChange, id }) => (
  <div
    id={id}
    onClick={() => onChange(!on)}
    style={{
      width: 42, height: 24, borderRadius: 12,
      background: on ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer', transition: 'background 0.25s ease',
      boxShadow: on ? '0 0 12px rgba(108,99,255,0.4)' : 'none',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: on ? 21 : 3,
      width: 18, height: 18, borderRadius: '50%',
      background: 'white', transition: 'left 0.25s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    }} />
  </div>
);

const SettingRow = ({ label, description, children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', borderBottom: '1px solid var(--border-subtle)',
  }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      {description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    slackIntegration: false,
    cpuThreshold: 80,
    memThreshold: 85,
    diskThreshold: 90,
    metricInterval: 60,
    logRetention: 30,
    darkMode: true,
    autoAcknowledge: false,
    maintenanceMode: false,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  return (
    <div className="page-content" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-description">System configuration and administrator preferences</div>
        </div>
        <button id="settings-save-btn" className="btn btn-primary">💾 Save Changes</button>
      </div>

      {/* Profile Section */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
          👤 Profile
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 800, color: 'white',
            boxShadow: 'var(--shadow-glow)',
          }}>
            {user?.avatar}
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</div>
            <span className="badge badge-purple" style={{ marginTop: '4px' }}>
              {user?.role === 'admin' ? '👑 Administrator' : '👁 Viewer'}
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>Edit Profile</button>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          🚨 Alert Configuration
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Configure thresholds that trigger alerts
        </div>

        <SettingRow label="Email Alerts" description="Send alert notifications to admin email">
          <ToggleSwitch id="toggle-email" on={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
        </SettingRow>
        <SettingRow label="Slack Integration" description="Send alerts to a Slack channel via webhook">
          <ToggleSwitch id="toggle-slack" on={settings.slackIntegration} onChange={() => toggle('slackIntegration')} />
        </SettingRow>
        <SettingRow label="Auto-Acknowledge" description="Automatically acknowledge alerts when resolved">
          <ToggleSwitch id="toggle-auto-ack" on={settings.autoAcknowledge} onChange={() => toggle('autoAcknowledge')} />
        </SettingRow>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'CPU Threshold (%)', key: 'cpuThreshold', color: 'var(--accent-primary-light)' },
            { label: 'Memory Threshold (%)', key: 'memThreshold', color: 'var(--accent-secondary)' },
            { label: 'Disk Threshold (%)', key: 'diskThreshold', color: 'var(--accent-orange)' },
          ].map(({ label, key, color }) => (
            <div key={key} style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace' }}>{settings[key]}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    onClick={() => set(key, Math.min(100, settings[key] + 5))}
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '10px', padding: '1px 4px' }}
                  >▲</button>
                  <button
                    onClick={() => set(key, Math.max(0, settings[key] - 5))}
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '10px', padding: '1px 4px' }}
                  >▼</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          📊 Monitoring Settings
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Adjust data collection and retention intervals
        </div>

        <SettingRow label="Metric Collection Interval" description={`Currently collecting every ${settings.metricInterval}s`}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[30, 60, 120, 300].map(v => (
              <button
                key={v}
                id={`interval-${v}`}
                className={`filter-pill ${settings.metricInterval === v ? 'active' : ''}`}
                onClick={() => set('metricInterval', v)}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {v}s
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Log Retention Period" description={`Logs retained for ${settings.logRetention} days`}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[7, 14, 30, 90].map(v => (
              <button
                key={v}
                id={`retention-${v}`}
                className={`filter-pill ${settings.logRetention === v ? 'active' : ''}`}
                onClick={() => set('logRetention', v)}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {v}d
              </button>
            ))}
          </div>
        </SettingRow>
      </div>

      {/* System */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          ⚙️ System
        </h3>

        <SettingRow label="Maintenance Mode" description="Pause all alerts and monitoring during maintenance windows">
          <ToggleSwitch id="toggle-maintenance" on={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} />
        </SettingRow>

        <SettingRow label="Dark Mode" description="Use dark theme (default for CloudOps)">
          <ToggleSwitch id="toggle-darkmode" on={settings.darkMode} onChange={() => toggle('darkMode')} />
        </SettingRow>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ padding: '24px', border: '1px solid rgba(255,77,109,0.3)', background: 'rgba(255,77,109,0.03)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          ⚠️ Danger Zone
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button id="reset-settings-btn" className="btn btn-danger btn-sm">Reset All Settings</button>
          <button id="clear-alerts-btn" className="btn btn-danger btn-sm">Clear All Alerts</button>
          <button id="purge-logs-btn" className="btn btn-danger btn-sm">Purge Logs</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
