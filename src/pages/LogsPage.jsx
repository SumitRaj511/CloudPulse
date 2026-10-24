import React, { useState, useRef } from 'react';
import { logs } from '../data/mockData';

const LogsPage = () => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [serverFilter, setServerFilter] = useState('all');
  const bottomRef = useRef(null);

  const servers = ['all', ...new Set(logs.map(l => l.server))];

  const filtered = logs.filter(l => {
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.server.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchServer = serverFilter === 'all' || l.server === serverFilter;
    return matchSearch && matchLevel && matchServer;
  });

  const levelColors = {
    INFO:    { text: 'var(--accent-blue)',   bg: 'rgba(77,159,255,0.12)' },
    WARN:    { text: 'var(--accent-yellow)', bg: 'rgba(240,208,96,0.12)' },
    ERROR:   { text: 'var(--accent-red)',    bg: 'rgba(240,92,122,0.12)' },
    SUCCESS: { text: 'var(--accent-green)',  bg: 'rgba(77,217,160,0.12)' },
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Logs</h1>
          <div className="page-description">Real-time application and monitoring log stream</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" id="logs-export-btn">⬇ Export Logs</button>
          <button className="btn btn-secondary btn-sm" id="logs-clear-btn">🗑 Clear</button>
        </div>
      </div>

      {/* Log Terminal Header */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Terminal Top Bar */}
        <div style={{
          background: 'rgba(0,0,0,0.4)', padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', flex: 1, textAlign: 'center' }}>
            cloudops — log stream
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot online" />
            <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>LIVE</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-glass)',
          flexWrap: 'wrap',
        }}>
          {/* Level Filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'INFO', 'WARN', 'ERROR'].map(level => (
              <button
                key={level}
                id={`log-level-${level.toLowerCase()}`}
                className={`filter-pill ${levelFilter === level ? 'active' : ''}`}
                onClick={() => setLevelFilter(level)}
                style={{ padding: '4px 10px' }}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Server Filter */}
          <select
            id="log-server-filter"
            value={serverFilter}
            onChange={e => setServerFilter(e.target.value)}
            style={{
              background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: '5px 10px', fontSize: '12px',
              color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
            }}
          >
            {servers.map(s => <option key={s} value={s}>{s === 'all' ? 'All Servers' : s}</option>)}
          </select>

          {/* Search */}
          <div className="search-bar" style={{ flex: 1 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>🔍</span>
            <input
              id="logs-search"
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
            />
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace' }}>
            {filtered.length} / {logs.length}
          </span>
        </div>

        {/* Log Content */}
        <div style={{
          background: '#06061a',
          maxHeight: '520px',
          overflowY: 'auto',
          padding: '10px 0',
          fontFamily: 'DM Mono, monospace',
        }}>
          {filtered.map((log, idx) => {
            const cfg = levelColors[log.level] || levelColors.INFO;
            return (
              <div
                key={log.id}
                id={`log-line-${log.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '190px 72px 120px 1fr',
                  gap: '12px',
                  padding: '4px 20px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  transition: 'background 0.1s',
                  borderLeft: `2px solid ${log.level === 'ERROR' ? 'rgba(240,92,122,0.5)' : 'transparent'}`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--text-dim)' }}>{log.timestamp}</span>
                <span style={{
                  color: cfg.text, fontWeight: 500, fontSize: '10px',
                  background: cfg.bg, padding: '1px 5px', borderRadius: '4px',
                  width: 'fit-content', alignSelf: 'center', letterSpacing: '0.04em',
                }}>
                  {log.level}
                </span>
                <span style={{ color: 'var(--accent-indigo-light)', opacity: 0.7, fontSize: '11px' }}>
                  [{log.server}]
                </span>
                <span style={{ color: log.level === 'ERROR' ? '#f08080' : log.level === 'WARN' ? '#d4b060' : 'var(--text-muted)', fontWeight: 300 }}>
                  {log.message}
                </span>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3a3a6a', fontSize: '13px' }}>
              No log entries match the current filters
            </div>
          )}

          {/* Blinking cursor */}
          <div style={{ padding: '4px 20px', fontSize: '12px', color: '#3a3a6a', fontFamily: 'JetBrains Mono, monospace' }}>
            <span style={{ animation: 'pulse-badge 1s step-end infinite', color: 'var(--accent-green)' }}>█</span>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Log Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
        {[
        { label: 'Total Entries', value: logs.length, color: 'var(--accent-indigo-light)' },
          { label: 'Info', value: logs.filter(l => l.level === 'INFO').length, color: 'var(--accent-blue)' },
          { label: 'Warnings', value: logs.filter(l => l.level === 'WARN').length, color: 'var(--accent-yellow)' },
          { label: 'Errors', value: logs.filter(l => l.level === 'ERROR').length, color: 'var(--accent-red)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 300, color: stat.color, letterSpacing: '-0.04em' }}>{stat.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsPage;
