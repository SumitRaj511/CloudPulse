import React, { useState } from 'react';
import { dockerContainers } from '../data/mockData';

const DockerPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = dockerContainers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.image.toLowerCase().includes(search.toLowerCase()) ||
      c.server.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const running = dockerContainers.filter(c => c.status === 'running').length;
  const stopped = dockerContainers.filter(c => c.status === 'stopped').length;

  const getCpuColor = (val) => {
    if (val > 50) return 'var(--accent-red)';
    if (val > 25) return 'var(--accent-yellow)';
    return 'var(--accent-green)';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Containers</h1>
          <div className="page-description">Health, resource usage, and status across all servers</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="search-bar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              id="docker-search"
              placeholder="Search containers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '180px' }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
        {[
          { label: 'Total',   value: dockerContainers.length,                                                        color: 'var(--accent-indigo-light)', icon: '▣' },
          { label: 'Running', value: running,                                                                         color: 'var(--accent-green)',         icon: '▶' },
          { label: 'Stopped', value: stopped,                                                                         color: 'var(--accent-red)',           icon: '◼' },
          { label: 'Images',  value: [...new Set(dockerContainers.map(c => c.image.split(':')[0]))].length,           color: 'var(--accent-cyan)',          icon: '◈' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
            <span style={{ fontSize: '15px', color: stat.color, opacity: 0.8 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 300, color: stat.color, lineHeight: 1, letterSpacing: '-0.04em' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {[['all', 'All', dockerContainers.length],
          ['running', 'Running', running],
          ['stopped', 'Stopped', stopped],
        ].map(([val, label, count]) => (
          <button
            key={val}
            id={`docker-filter-${val}`}
            className={`filter-pill ${filter === val ? 'active' : ''}`}
            onClick={() => setFilter(val)}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Container Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Container</th>
                <th>Image</th>
                <th>Status</th>
                <th>Server</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Port</th>
                <th>Uptime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(container => (
                <tr key={container.id} id={`container-row-${container.id}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🐳</span>
                      <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>{container.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: '1px' }}>{container.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                      {container.image}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${container.status === 'running' ? 'badge-green' : 'badge-red'}`}>
                      {container.status === 'running' ? 'running' : 'stopped'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--accent-indigo-light)', fontFamily: 'DM Mono, monospace' }}>
                      {container.server}
                    </span>
                  </td>
                  <td>
                    {container.status === 'running' ? (
                      <div>
                        <div style={{ fontWeight: 500, color: getCpuColor(container.cpu), fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                          {container.cpu}%
                        </div>
                        <div className="progress-bar" style={{ height: '3px', marginTop: '4px', width: '60px' }}>
                          <div className="progress-fill" style={{ width: `${Math.min(100, container.cpu * 2)}%`, background: getCpuColor(container.cpu) }} />
                        </div>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    {container.status === 'running' ? (
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                          {container.memory} MB
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>/ {container.memoryMax} MB</div>
                        <div className="progress-bar" style={{ height: '3px', marginTop: '4px', width: '60px' }}>
                          <div className="progress-fill" style={{
                            width: `${(container.memory / container.memoryMax) * 100}%`,
                            background: `${(container.memory / container.memoryMax) > 0.8 ? 'var(--accent-red)' : 'var(--accent-secondary)'}`
                          }} />
                        </div>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    {container.port !== '-' ? (
                      <span className="badge badge-blue" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}>:{container.port}</span>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {container.uptime}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {container.status === 'running' ? (
                        <button className="btn btn-danger btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>⏹ Stop</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>▶ Start</button>
                      )}
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>Logs</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🐳</div>
            <div className="empty-state-title">No containers found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DockerPage;
