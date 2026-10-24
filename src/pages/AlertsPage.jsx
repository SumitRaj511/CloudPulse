import React, { useState } from 'react';
import { alerts as initialAlerts } from '../data/mockData';

const AlertsPage = () => {
  const [alertList, setAlertList] = useState(initialAlerts);
  const [filter, setFilter] = useState('all');

  const acknowledge = (id) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const acknowledgeAll = () => {
    setAlertList(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const filtered = alertList.filter(a => {
    if (filter === 'active') return !a.acknowledged;
    if (filter === 'acknowledged') return a.acknowledged;
    if (filter === 'critical') return a.level === 'critical';
    if (filter === 'warning') return a.level === 'warning';
    return true;
  });

  const activeCount = alertList.filter(a => !a.acknowledged).length;
  const criticalCount = alertList.filter(a => a.level === 'critical' && !a.acknowledged).length;

  const levelConfig = {
    critical: { icon: '!', color: 'var(--accent-red)',    bg: 'rgba(240,92,122,0.07)',  border: 'rgba(240,92,122,0.25)',  label: 'CRITICAL' },
    warning:  { icon: '~', color: 'var(--accent-orange)', bg: 'rgba(240,136,92,0.07)', border: 'rgba(240,136,92,0.25)', label: 'WARNING'  },
    info:     { icon: 'i', color: 'var(--accent-blue)',   bg: 'rgba(77,159,255,0.07)',  border: 'rgba(77,159,255,0.25)',  label: 'INFO'     },
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts</h1>
          <div className="page-description">
            {activeCount > 0 ? (
              <span style={{ color: 'var(--accent-red)', fontWeight: 400 }}>{activeCount} active alert{activeCount !== 1 ? 's' : ''} require attention</span>
            ) : (
              <span style={{ color: 'var(--accent-green)', fontWeight: 400 }}>All alerts acknowledged</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button id="acknowledge-all-btn" className="btn btn-secondary" onClick={acknowledgeAll} disabled={activeCount === 0}>
            Acknowledge All
          </button>
          <button id="create-alert-btn" className="btn btn-primary">+ Create Rule</button>
        </div>
      </div>

      {/* Active Alert Banner */}
      {criticalCount > 0 && (
        <div style={{
          background: 'rgba(240,92,122,0.07)',
          border: '1px solid rgba(240,92,122,0.22)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'rgba(240,92,122,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent-red)', fontSize: '16px', fontWeight: 700 }}>!</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--accent-red)' }}>
              {criticalCount} Critical Alert{criticalCount !== 1 ? 's' : ''} Active
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 300 }}>
              Immediate action required. Review and acknowledge below.
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-danger btn-sm">Escalate</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
        {[
          { label: 'Total',        value: alertList.length,                                   color: 'var(--accent-indigo-light)', icon: '○' },
          { label: 'Active',       value: activeCount,                                        color: 'var(--accent-red)',          icon: '●' },
          { label: 'Critical',     value: alertList.filter(a => a.level === 'critical').length, color: 'var(--accent-orange)',       icon: '▲' },
          { label: 'Acknowledged', value: alertList.filter(a => a.acknowledged).length,       color: 'var(--accent-green)',        icon: '✓' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
            <span style={{ fontSize: '16px', color: stat.color, opacity: 0.8 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 300, color: stat.color, lineHeight: 1, letterSpacing: '-0.04em' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {[['all', 'All'], ['active', 'Active'], ['critical', 'Critical'], ['warning', 'Warning'], ['acknowledged', 'Acknowledged']].map(([val, label]) => (
          <button
            key={val}
            id={`alert-filter-${val}`}
            className={`filter-pill ${filter === val ? 'active' : ''}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert Thresholds */}
      <div className="card" style={{ padding: '18px', marginBottom: '18px' }}>
        <div className="card-header">
          <div className="card-title">Alert Thresholds</div>
          <button className="btn btn-secondary btn-sm">Edit</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { label: 'CPU Usage',    threshold: '80%', current: '87%', status: 'exceeded' },
            { label: 'Memory Usage', threshold: '85%', current: '82%', status: 'ok'       },
            { label: 'Disk Usage',   threshold: '90%', current: '91%', status: 'exceeded' },
            { label: 'Uptime',       threshold: '99.9%', current: '99.8%', status: 'warning' },
          ].map(t => (
            <div key={t.label} style={{
              background: 'var(--bg-glass)',
              border: `1px solid ${t.status === 'exceeded' ? 'rgba(240,92,122,0.25)' : t.status === 'warning' ? 'rgba(240,208,96,0.25)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '11px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '-0.03em', color: t.status === 'exceeded' ? 'var(--accent-red)' : t.status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
                {t.current}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Threshold: {t.threshold}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(alert => {
          const cfg = levelConfig[alert.level];
          return (
            <div key={alert.id} id={`alert-${alert.id}`} style={{
              background: alert.acknowledged ? 'rgba(255,255,255,0.02)' : cfg.bg,
              border: `1px solid ${alert.acknowledged ? 'var(--border-subtle)' : cfg.border}`,
              borderLeft: `2px solid ${alert.acknowledged ? 'var(--text-dim)' : cfg.color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              opacity: alert.acknowledged ? 0.5 : 1,
              transition: 'var(--transition-base)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)',
                background: `${cfg.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0, fontWeight: 700, color: cfg.color,
              }}>
                {cfg.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{alert.title}</span>
                  <span className="badge" style={{ background: `${cfg.color}15`, color: cfg.color, fontSize: '9px', letterSpacing: '0.06em' }}>{cfg.label}</span>
                  {alert.acknowledged && <span className="badge badge-green" style={{ fontSize: '9px' }}>ACKNOWLEDGED</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 300 }}>{alert.description}</div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                  <span>{alert.server}</span>
                  <span>{alert.date} {alert.time}</span>
                </div>
              </div>

              {!alert.acknowledged && (
                <button
                  id={`ack-alert-${alert.id}`}
                  className="btn btn-secondary btn-sm"
                  onClick={() => acknowledge(alert.id)}
                >
                  ✓ Acknowledge
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-title">No alerts found</div>
          <div style={{ fontSize: '13px' }}>All systems are operating within normal parameters</div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
