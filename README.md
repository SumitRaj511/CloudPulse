# CloudOps Monitor 🚀

> **A full-stack infrastructure monitoring platform** — real-time server metrics, Docker container monitoring, JWT authentication, role-based access control, and automated CI/CD to AWS EC2.

![CloudOps Monitor](https://img.shields.io/badge/CloudOps-Monitor-6c63ff?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-2.0-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge)

---
# 📷 Screenshots

## Login Page

<p align="center">
<img src="https://github.com/SumitRaj511/CloudPulse/blob/0a6679266e8857f27d60217bb2103a846e1a7dfe/Screenshots/Login%20Page.png" width="800">
</p>

---

## Dashboard

<p align="center">
<img src="https://github.com/SumitRaj511/CloudPulse/blob/0a6679266e8857f27d60217bb2103a846e1a7dfe/Screenshots/Dashboard.png" width="800">
</p>

---

## Servers

<p align="center">
<img src="https://github.com/SumitRaj511/CloudPulse/blob/0a6679266e8857f27d60217bb2103a846e1a7dfe/Screenshots/Servers.png" width="800">
</p>

---

## Containers

<p align="center">
<img src="https://github.com/SumitRaj511/CloudPulse/blob/3e4efadc72eb1aa68b9aa6682b1bcaaeed36b191/Screenshots/Containers.png" width="800">
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| Server Monitoring | Real-time CPU, RAM, disk, network per server |
| Docker Monitoring | Container health, CPU/memory usage, start/stop |
| Smart Alerts | Configurable thresholds, acknowledge workflow |
| Log Stream | Terminal-style live log viewer with filtering |
| Historical Charts | Recharts area/line charts with live updates |
| JWT Auth + RBAC | Admin and Viewer roles |
| Settings | Threshold config, toggle switches, danger zone |
| CI/CD | GitHub Actions to Docker to AWS EC2 |

---

## Architecture

```
cloudops-monitor/
├── src/                    # React frontend
│   ├── components/         # Sidebar, Header, CircularProgress
│   ├── pages/              # Dashboard, Servers, Docker, Alerts, Logs, Settings
│   ├── context/            # AuthContext (JWT simulation)
│   └── data/               # Mock data (servers, alerts, logs)
├── backend/                # FastAPI backend
│   ├── main.py             # API routes, auth, psutil metrics
│   └── requirements.txt
├── agent/                  # Python monitoring agent
│   └── agent.py            # psutil + Docker SDK collector
├── .github/workflows/      # CI/CD pipeline
│   └── ci-cd.yml
├── docker-compose.yml      # Full stack orchestration
└── README.md
```

---

## Quick Start

### Frontend Only (Dev)

```bash
npm install
npm run dev
# Open http://localhost:5173
```

Demo Credentials:
- Admin: admin@cloudops.io / admin123
- Viewer: viewer@cloudops.io / viewer123

### Full Stack (Docker)

```bash
docker-compose up -d
# Frontend: http://localhost
# API docs: http://localhost:8000/docs
```

### Backend Only

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Monitoring Agent

```bash
cd agent
pip install psutil requests docker
python agent.py --server-id 1 --api-url http://localhost:8000 --interval 60
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | JWT authentication |
| GET | /api/servers | List all servers |
| GET | /api/servers/{id}/metrics | Real-time metrics (psutil) |
| POST | /api/servers | Add server (admin only) |
| GET | /api/docker/containers | List Docker containers |
| GET | /api/alerts | Get all alerts |
| POST | /api/alerts/{id}/acknowledge | Acknowledge alert |
| GET | /api/logs | Get log entries (filterable) |
| GET | /api/health | API health check |

---

## Tech Stack

- Frontend: React 18, Recharts, Vite
- Backend: FastAPI, psutil, PyJWT, Docker SDK
- Database: PostgreSQL, SQLAlchemy
- Infrastructure: Docker Compose, Nginx, AWS EC2
- CI/CD: GitHub Actions

---

## Resume Points

CloudOps Monitor - Infrastructure Monitoring and Alerting Platform:
- Developed a full-stack infrastructure monitoring platform using React, FastAPI, and PostgreSQL to monitor server health, CPU, memory, disk, and network metrics.
- Built a Python-based monitoring agent using psutil and Docker SDK for real-time infrastructure and container health tracking.
- Implemented JWT authentication, role-based access control (RBAC), configurable alert thresholds, and historical performance dashboards.
- Containerized the application using Docker Compose and automated deployment to AWS EC2 using a GitHub Actions CI/CD pipeline.
