// Dummy data for CloudOps Monitor

export const servers = [
  {
    id: 1,
    name: 'prod-web-01',
    ip: '10.0.1.10',
    region: 'us-east-1',
    status: 'online',
    uptime: '99.98%',
    uptimeSeconds: 1234567,
    os: 'Ubuntu 22.04 LTS',
    cpu: 42,
    memory: 67,
    disk: 58,
    network: { in: 12.4, out: 8.2 },
    processes: 148,
    tags: ['production', 'web'],
  },
  {
    id: 2,
    name: 'prod-api-02',
    ip: '10.0.1.11',
    region: 'us-east-1',
    status: 'warning',
    uptime: '99.81%',
    uptimeSeconds: 987321,
    os: 'Ubuntu 22.04 LTS',
    cpu: 87,
    memory: 82,
    disk: 71,
    network: { in: 45.1, out: 23.7 },
    processes: 223,
    tags: ['production', 'api'],
  },
  {
    id: 3,
    name: 'prod-db-01',
    ip: '10.0.2.5',
    region: 'us-east-1',
    status: 'online',
    uptime: '100%',
    uptimeSeconds: 2345678,
    os: 'CentOS 8',
    cpu: 34,
    memory: 78,
    disk: 91,
    network: { in: 5.8, out: 3.2 },
    processes: 87,
    tags: ['production', 'database'],
  },
  {
    id: 4,
    name: 'staging-01',
    ip: '10.0.3.20',
    region: 'us-west-2',
    status: 'offline',
    uptime: '89.2%',
    uptimeSeconds: 0,
    os: 'Ubuntu 20.04 LTS',
    cpu: 0,
    memory: 0,
    disk: 45,
    network: { in: 0, out: 0 },
    processes: 0,
    tags: ['staging'],
  },
  {
    id: 5,
    name: 'worker-node-01',
    ip: '10.0.4.15',
    region: 'eu-west-1',
    status: 'online',
    uptime: '99.95%',
    uptimeSeconds: 1876543,
    os: 'Debian 11',
    cpu: 23,
    memory: 45,
    disk: 38,
    network: { in: 8.1, out: 4.6 },
    processes: 102,
    tags: ['worker'],
  },
  {
    id: 6,
    name: 'monitor-01',
    ip: '10.0.5.2',
    region: 'us-east-1',
    status: 'online',
    uptime: '100%',
    uptimeSeconds: 3456789,
    os: 'Ubuntu 22.04 LTS',
    cpu: 12,
    memory: 34,
    disk: 28,
    network: { in: 2.3, out: 1.1 },
    processes: 65,
    tags: ['monitoring'],
  },
];

export const dockerContainers = [
  { id: 'c1', name: 'nginx-proxy', image: 'nginx:1.25', status: 'running', cpu: 3.2, memory: 128, memoryMax: 256, uptime: '14d 6h', port: '80, 443', server: 'prod-web-01' },
  { id: 'c2', name: 'backend-api', image: 'myapp/backend:v2.4.1', status: 'running', cpu: 12.8, memory: 512, memoryMax: 1024, uptime: '3d 12h', port: '8080', server: 'prod-api-02' },
  { id: 'c3', name: 'postgres-db', image: 'postgres:15', status: 'running', cpu: 8.1, memory: 768, memoryMax: 2048, uptime: '14d 6h', port: '5432', server: 'prod-db-01' },
  { id: 'c4', name: 'redis-cache', image: 'redis:7-alpine', status: 'stopped', cpu: 0, memory: 0, memoryMax: 256, uptime: '-', port: '6379', server: 'prod-api-02' },
  { id: 'c5', name: 'grafana', image: 'grafana/grafana:10.0', status: 'running', cpu: 4.5, memory: 256, memoryMax: 512, uptime: '7d 2h', port: '3000', server: 'monitor-01' },
  { id: 'c6', name: 'prometheus', image: 'prom/prometheus:v2.47', status: 'running', cpu: 6.2, memory: 384, memoryMax: 512, uptime: '7d 2h', port: '9090', server: 'monitor-01' },
  { id: 'c7', name: 'celery-worker', image: 'myapp/worker:v2.4.1', status: 'running', cpu: 18.4, memory: 320, memoryMax: 512, uptime: '1d 8h', port: '-', server: 'worker-node-01' },
  { id: 'c8', name: 'frontend-app', image: 'myapp/frontend:v3.1.0', status: 'running', cpu: 2.1, memory: 64, memoryMax: 256, uptime: '14d 6h', port: '3001', server: 'prod-web-01' },
];

export const alerts = [
  {
    id: 'a1',
    level: 'critical',
    title: 'Server Unreachable',
    description: 'prod-db-01 disk usage at 91% – approaching critical threshold',
    server: 'prod-db-01',
    time: '02:05:14',
    date: '2026-10-20',
    acknowledged: false,
  },
  {
    id: 'a2',
    level: 'warning',
    title: 'High CPU Usage',
    description: 'prod-api-02 CPU usage at 87% for more than 10 minutes',
    server: 'prod-api-02',
    time: '02:01:22',
    date: '2026-10-20',
    acknowledged: false,
  },
  {
    id: 'a3',
    level: 'critical',
    title: 'Server Offline',
    description: 'staging-01 is unreachable – no heartbeat received',
    server: 'staging-01',
    time: '01:48:33',
    date: '2026-10-20',
    acknowledged: false,
  },
  {
    id: 'a4',
    level: 'warning',
    title: 'Container Stopped',
    description: 'redis-cache container stopped unexpectedly on prod-api-02',
    server: 'prod-api-02',
    time: '01:35:07',
    date: '2026-10-20',
    acknowledged: true,
  },
  {
    id: 'a5',
    level: 'warning',
    title: 'High Memory Usage',
    description: 'prod-api-02 memory usage at 82%, nearing 85% threshold',
    server: 'prod-api-02',
    time: '01:20:45',
    date: '2026-10-20',
    acknowledged: true,
  },
  {
    id: 'a6',
    level: 'info',
    title: 'Auto-scaling Triggered',
    description: 'worker-node-01 auto-scaled to handle increased load',
    server: 'worker-node-01',
    time: '00:58:12',
    date: '2026-10-20',
    acknowledged: true,
  },
];

export const logs = [
  { id: 'l1', timestamp: '2026-10-20 02:05:20', level: 'ERROR', message: 'Docker container redis-cache stopped unexpectedly', server: 'prod-api-02' },
  { id: 'l2', timestamp: '2026-10-20 02:05:14', level: 'WARN', message: 'Disk usage exceeded 90% threshold: 91% used on /dev/sda1', server: 'prod-db-01' },
  { id: 'l3', timestamp: '2026-10-20 02:02:01', level: 'INFO', message: 'Metrics collected: CPU 87%, RAM 82%, Disk 71%, Net 45.1MB/s', server: 'prod-api-02' },
  { id: 'l4', timestamp: '2026-10-20 02:01:22', level: 'WARN', message: 'CPU usage exceeded 80% for 10+ consecutive minutes', server: 'prod-api-02' },
  { id: 'l5', timestamp: '2026-10-20 01:55:00', level: 'INFO', message: 'Health check passed – all services responding', server: 'prod-web-01' },
  { id: 'l6', timestamp: '2026-10-20 01:48:33', level: 'ERROR', message: 'Connection timeout – server unreachable after 3 retries', server: 'staging-01' },
  { id: 'l7', timestamp: '2026-10-20 01:45:00', level: 'INFO', message: 'Monitoring agent heartbeat received', server: 'prod-db-01' },
  { id: 'l8', timestamp: '2026-10-20 01:40:17', level: 'INFO', message: 'Backup completed successfully – 4.2GB archived', server: 'prod-db-01' },
  { id: 'l9', timestamp: '2026-10-20 01:35:07', level: 'WARN', message: 'Container redis-cache restarted (exit code: 137 – OOM)', server: 'prod-api-02' },
  { id: 'l10', timestamp: '2026-10-20 01:30:00', level: 'INFO', message: 'Nginx config reloaded – 0 errors', server: 'prod-web-01' },
  { id: 'l11', timestamp: '2026-10-20 01:25:45', level: 'INFO', message: 'SSL certificate renewed – valid until 2027-10-20', server: 'prod-web-01' },
  { id: 'l12', timestamp: '2026-10-20 01:20:45', level: 'WARN', message: 'Memory usage at 82% – approaching warning threshold', server: 'prod-api-02' },
  { id: 'l13', timestamp: '2026-10-20 01:15:00', level: 'INFO', message: 'Worker process spawned – PID 4821', server: 'worker-node-01' },
  { id: 'l14', timestamp: '2026-10-20 01:10:30', level: 'INFO', message: 'Database vacuum completed – reclaimed 2.1GB', server: 'prod-db-01' },
  { id: 'l15', timestamp: '2026-10-20 00:58:12', level: 'INFO', message: 'Auto-scaling event: +1 worker node provisioned', server: 'worker-node-01' },
];

// Generate historical time-series data
const generateTimeSeries = (baseValues, points = 30) => {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now - i * 5 * 60 * 1000);
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
    const point = { time: timeStr };
    Object.keys(baseValues).forEach(key => {
      const base = baseValues[key];
      const variance = base * 0.3;
      point[key] = Math.max(0, Math.min(100, Math.round(base + (Math.random() - 0.5) * variance)));
    });
    data.push(point);
  }
  return data;
};

export const cpuHistory = generateTimeSeries({ cpu: 55, memory: 70, disk: 75 });
export const networkHistory = (() => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now - i * 5 * 60 * 1000);
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
    data.push({
      time: timeStr,
      inbound: Math.round((Math.random() * 60 + 10) * 10) / 10,
      outbound: Math.round((Math.random() * 30 + 5) * 10) / 10,
    });
  }
  return data;
})();

export const overviewStats = {
  totalServers: 6,
  onlineServers: 4,
  warningServers: 1,
  offlineServers: 1,
  totalContainers: 8,
  runningContainers: 7,
  activeAlerts: 3,
  avgCpu: 33,
  avgMemory: 51,
};
