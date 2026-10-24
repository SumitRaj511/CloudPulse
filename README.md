# CloudPulse 🚀

> **A full-stack infrastructure monitoring and alerting platform** — real-time server metrics, Docker container monitoring, smart alerts, JWT authentication, role-based access control, and automated CI/CD deployment to AWS EC2.

![CloudPulse](https://img.shields.io/badge/CloudPulse-Infrastructure%20Monitoring-6c63ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-2.0-00d4ff?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge)

---

## 📌 Overview

**CloudPulse** is a full-stack infrastructure monitoring platform designed to provide centralized visibility into server and Docker container health.

It collects and displays real-time infrastructure metrics such as **CPU, memory, disk, and network usage**, while providing configurable alerts, log monitoring, authentication, and role-based access control.

The application is containerized using **Docker Compose** and can be deployed to **AWS EC2 through a GitHub Actions CI/CD pipeline**.

---

# 📷 Screenshots

## Login Page

<p align="center">
  <img src="https://github.com/SumitRaj511/CloudPulse/blob/3d5e5d1d7b920098dd567307d5d8047639834e2c/Screenshots/Login%20Page.png" width="500">
</p>

---

## Dashboard

<p align="center">
  <img src="https://github.com/SumitRaj511/CloudPulse/blob/0a6679266e8857f27d60217bb2103a846e1a7dfe/Screenshots/Dashboard.png" width="850">
</p>

---

## Servers

<p align="center">
  <img src="https://github.com/SumitRaj511/CloudPulse/blob/0a6679266e8857f27d60217bb2103a846e1a7dfe/Screenshots/Servers.png" width="850">
</p>

---

## Containers

<p align="center">
  <img src="https://github.com/SumitRaj511/CloudPulse/blob/3e4efadc72eb1aa68b9aa6682b1bcaaeed36b191/Screenshots/Containers.png" width="850">
</p>

---

# ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ Server Monitoring | Real-time CPU, RAM, disk, and network monitoring |
| 🐳 Docker Monitoring | Container health and resource usage monitoring |
| 🚨 Smart Alerts | Configurable thresholds and alert acknowledgement |
| 📋 Log Stream | Live terminal-style log viewer with filtering |
| 📊 Historical Charts | Performance visualization using Recharts |
| 🔐 JWT Authentication | Secure user authentication |
| 👥 RBAC | Admin and Viewer role-based access |
| ⚙️ Settings | Configurable monitoring thresholds and system settings |
| 🚀 CI/CD | Automated Docker deployment to AWS EC2 |

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │   Dashboard / Logs   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI API      │
                         │ Auth / Metrics / API │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
           ┌─────────────────┐                ┌─────────────────┐
           │   PostgreSQL    │                │ Monitoring Agent│
           │     Database    │                │ psutil + Docker │
           └─────────────────┘                └────────┬────────┘
                                                       │
                                                       ▼
                                             ┌─────────────────┐
                                             │ Docker / Server │
                                             │ Infrastructure  │
                                             └─────────────────┘

                    GitHub Actions → Docker → AWS EC2
```

---

# 📁 Project Structure

```text
cloudpulse/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── data/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── agent/
│   └── agent.py
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── screenshots/
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

- Node.js
- Python 3
- Docker
- Docker Compose
- Git

---

## Frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Demo Credentials

```text
Admin
Email: admin@cloudops.io
Password: admin123

Viewer
Email: viewer@cloudops.io
Password: viewer123
```

---

## 🐳 Run with Docker

Start the complete application:

```bash
docker-compose up -d
```

Frontend:

```text
http://localhost
```

API documentation:

```text
http://localhost:8000/docs
```

Stop the application:

```bash
docker-compose down
```

---

## 🐍 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📡 Monitoring Agent

```bash
cd agent
pip install psutil requests docker

python agent.py \
  --server-id 1 \
  --api-url http://localhost:8000 \
  --interval 60
```

---

# 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | JWT authentication |
| GET | `/api/servers` | List monitored servers |
| GET | `/api/servers/{id}/metrics` | Get real-time server metrics |
| POST | `/api/servers` | Add a server |
| GET | `/api/docker/containers` | List Docker containers |
| GET | `/api/alerts` | Retrieve alerts |
| POST | `/api/alerts/{id}/acknowledge` | Acknowledge an alert |
| GET | `/api/logs` | Retrieve filtered logs |
| GET | `/api/health` | API health check |

---

# 🛠️ Tech Stack

### Frontend
- React
- Vite
- Recharts
- Axios
- React Router

### Backend
- FastAPI
- Python
- PyJWT
- SQLAlchemy
- psutil
- Docker SDK

### Database
- PostgreSQL

### DevOps & Infrastructure
- Docker
- Docker Compose
- Nginx
- AWS EC2
- GitHub Actions

---

# 🚀 CI/CD Pipeline

CloudPulse uses **GitHub Actions** to automate the deployment workflow.

```text
Git Push
   ↓
GitHub Actions
   ↓
Build Application
   ↓
Build Docker Images
   ↓
Deploy to AWS EC2
   ↓
Run Containers
   ↓
Application Live
```

---

# 🔐 Security

CloudPulse includes:

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Admin and Viewer roles
- Protected API endpoints
- Configurable monitoring thresholds
- Containerized services

---

# 📈 Monitoring Capabilities

The monitoring agent collects infrastructure information using **psutil** and the Docker SDK.

Monitored resources include:

- CPU utilization
- Memory utilization
- Disk usage
- Network activity
- Docker container health
- Container CPU and memory usage
- Application logs

---

# 💼 Resume Points

**CloudPulse – Infrastructure Monitoring & Alerting Platform**

- Built a full-stack monitoring platform using **React, FastAPI, and PostgreSQL**.
- Developed **Python-based server and Docker monitoring** with real-time alerts.
- Implemented **Docker, GitHub Actions CI/CD, and AWS EC2** deployment.

---

# 👨‍💻 Author

**Sumit Raj**

B.Tech – Computer Science & Cyber Security  
Dayananda Sagar University, Bangalore

---
