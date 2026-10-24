# CloudPulse 🚀

> **A full-stack infrastructure monitoring and alerting platform** — real-time server metrics, Docker container monitoring, smart alerts, JWT authentication, role-based access control, and automated CI/CD deployment using **Jenkins and GitHub Actions** to AWS EC2.

![CloudPulse](https://img.shields.io/badge/CloudPulse-Infrastructure%20Monitoring-6c63ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-2.0-00d4ff?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge)
![Nginx](https://img.shields.io/badge/Nginx-Web%20Server-009639?style=for-the-badge)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automation-2088FF?style=for-the-badge)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge)
![Linux](https://img.shields.io/badge/Linux-Administration-FCC624?style=for-the-badge)

---

## 📌 Overview

**CloudPulse** is a full-stack infrastructure monitoring platform designed to provide centralized visibility into server and Docker container health.

It collects and displays real-time infrastructure metrics such as **CPU, memory, disk, and network usage**, while providing configurable alerts, log monitoring, authentication, and role-based access control.

The application is containerized using **Docker Compose** and supports automated CI/CD workflows using **Jenkins and GitHub Actions**, with deployment to **AWS EC2**.

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
| 🔄 CI/CD Automation | Automated build, test, and deployment workflows |
| 🔧 Jenkins Pipeline | Jenkins-based CI/CD pipeline automation |
| ⚡ GitHub Actions | Automated workflow execution |
| ☁️ AWS Deployment | Application deployment on AWS EC2 |

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │ Dashboard / Logs     │
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

             ┌─────────────────────────────────────────────┐
             │                CI/CD Pipeline                │
             │                                             │
             │ GitHub → Jenkins → Docker → AWS EC2        │
             └─────────────────────────────────────────────┘
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
├── Jenkinsfile
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
- Jenkins

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

# 🔄 CI/CD Automation

CloudPulse uses **GitHub Actions** to automate the software delivery workflow.

### Jenkins Pipeline

```text
Developer Push
      ↓
   GitHub
      ↓
   Jenkins
      ↓
   Checkout
      ↓
   Build
      ↓
   Test
      ↓
Docker Build
      ↓
Docker Deploy
      ↓
  AWS EC2
```

Jenkins Pipeline allows the build, test, and deployment workflow to be defined as code and automated through a `Jenkinsfile`.

### GitHub Actions

GitHub Actions is used for repository-based workflow automation and CI/CD.

```text
Git Push
   ↓
GitHub Actions
   ↓
Build & Validate
   ↓
Docker
   ↓
Deployment
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
- Linux

### CI/CD & Automation
- Jenkins
- GitHub Actions
- Docker-based deployment
- CI/CD Automation

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

# 👨‍💻 Author

**Sumit Raj**

B.Tech – Computer Science & Cyber Security  
Dayananda Sagar University, Bangalore

---
