import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CircularProgress from '../components/CircularProgress';
import { servers, cpuHistory } from '../data/mockData';

const getStatusColor = (status) => {
  if (status === 'online') return 'var(--accent-green)';
  if (status === 'warning') return 'var(--accent-yellow)';
  return 'var(--accent-red)';
};

const getBarColor = (val) => {
  if (val >= 90) return 'var(--accent-red)';
  if (val >= 75) return 'var(--accent-orange)';
  if (val >= 60) return 'var(--accent-yellow)';
  return 'var(--accent-green)';
};

const formatUptime = (seconds) => {
  if (!seconds) return 'Offline';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

const ServerDetailModal = ({ server, onClose }) => {
  if (!server) return null;
  const serverHistory = cpuHistory.map(d => ({
    time: d.time,
    cpu: Math.max(5, Math.min(99, server.cpu + (Math.random()-0.5)*15)),
    memory: Math.max(10, Math.min(99, server.memory + (Math.random()-0.5)*10)),
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(4,4,20,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: 'rgba(12,12,36,0.97)', border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)', padding: '30px', width: '680px', maxWidth: '95vw',
        maxHeight: '85vh', overflowY: 'auto', position: 'relative',
        boxShadow: 'var(--shadow-float)',
        backdropFilter: 'blur(32px)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <span className={`status-dot ${server.status}`} style={{ width: 10, height: 10 }} />
          <h2 style={{ fontSize: '18px', fontWeight: 400, letterSpacing: '-0.02em' }}>{server.name}</h2>
          <span className={`badge ${server.status === 'online' ? 'badge-green' : server.status === 'warning' ? 'badge-yellow' : 'badge-red'}`}>
            {server.status}
          </span>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', width: 30, height: 30, cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            ['IP Address', server.ip],
            ['Region', server.region],
            ['OS', server.os],
            ['Uptime', formatUptime(server.uptimeSeconds)],
            ['Processes', server.processes],
            ['Network In/Out', `${server.network.in} / ${server.network.out} MB/s`],
          ].map(([label, value]) => (
            <div key={label} style={{
              background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: '11px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '13px', fontWeight: 400, fontFamily: 'DM Mono, monospace', color: 'var(--text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Circular Gauges */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
          <CircularProgress value={server.cpu}    size={96} label="CPU"    color="#5b5fc7" />
          <CircularProgress value={server.memory} size={96} label="Memory" color="#62e0f5" />
          <CircularProgress value={server.disk}   size={96} label="Disk"   color="#4dd9a0" />
        </div>

        {/* Mini Chart */}
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Historical Performance (last 2.5h)
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={serverHistory} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="serverCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b5fc7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#5b5fc7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={5} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
              <Tooltip />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#5b5fc7" fill="url(#serverCpu)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
          {server.tags.map(tag => (
            <span key={tag} className="badge badge-purple">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServersPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedServer, setSelectedServer] = useState(null);

  const filtered = servers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ip.includes(search) || s.region.includes(search);
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });


  return (
    <div className="page-content">
      {selectedServer && (
        <ServerDetailModal server={selectedServer} onClose={() => setSelectedServer(null)} />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Server Fleet</h1>
          <div className="page-description">{servers.length} servers · {[...new Set(servers.map(s => s.region))].length} regions</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="search-bar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              id="servers-search"
              placeholder="Search servers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '180px' }}
            />
          </div>
          <button id="add-server-btn" className="btn btn-primary">+ Add Server</button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[['all', 'All', servers.length],
          ['online', 'Online', servers.filter(s => s.status === 'online').length],
          ['warning', 'Warning', servers.filter(s => s.status === 'warning').length],
          ['offline', 'Offline', servers.filter(s => s.status === 'offline').length],
        ].map(([val, label, count]) => (
          <button
            key={val}
            id={`filter-${val}`}
            className={`filter-pill ${filter === val ? 'active' : ''}`}
            onClick={() => setFilter(val)}
          >
            {label} <span style={{ opacity: 0.6 }}>({count})</span>
          </button>
        ))}
      </div>

      {/* Server Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(server => (
          <div
            key={server.id}
            id={`server-card-${server.id}`}
            className={`server-card ${server.status}`}
            onClick={() => setSelectedServer(server)}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span className={`status-dot ${server.status}`} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{server.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: '1px' }}>{server.ip} · {server.region}</div>
              </div>
              <span className={`badge ${server.status === 'online' ? 'badge-green' : server.status === 'warning' ? 'badge-yellow' : 'badge-red'}`}>
                {server.status}
              </span>
            </div>

            {/* OS & Uptime */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-purple" style={{ fontSize: '10px' }}>{server.os}</span>
              <span className="badge badge-blue" style={{ fontSize: '10px' }}>{formatUptime(server.uptimeSeconds)}</span>
            </div>

            {/* Metrics */}
            {server.status !== 'offline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'CPU', value: server.cpu },
                  { label: 'Memory', value: server.memory },
                  { label: 'Disk', value: server.disk },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: 400, color: getBarColor(value), fontFamily: 'DM Mono, monospace' }}>{value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${value}%`, background: getBarColor(value) }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {server.status === 'offline' && (
              <div style={{
                textAlign: 'center', padding: '14px', color: 'var(--accent-red)',
                fontSize: '12px', background: 'rgba(240,92,122,0.05)', fontWeight: 300,
                borderRadius: 'var(--radius-md)', border: '1px dashed rgba(240,92,122,0.2)',
              }}>
                Server unreachable — no heartbeat received
              </div>
            )}

            {/* Network */}
            {server.status !== 'offline' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                <span>↓ {server.network.in}</span>
                <span>↑ {server.network.out} MB/s</span>
                <span>· {server.processes} procs</span>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
              {server.tags.map(tag => (
                <span key={tag} className="badge badge-purple" style={{ fontSize: '10px' }}>{tag}</span>
              ))}
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'right', letterSpacing: '0.04em' }}>
              click for details
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖥️</div>
          <div className="empty-state-title">No servers found</div>
          <div style={{ fontSize: '13px' }}>Try changing your search or filter</div>
        </div>
      )}
    </div>
  );
};

export default ServersPage;
