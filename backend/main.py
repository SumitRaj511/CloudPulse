"""
CloudOps Monitor – FastAPI Backend
"""
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import psutil
import random

app = FastAPI(
    title="CloudOps Monitor API",
    description="Infrastructure monitoring backend for CloudOps Monitor dashboard",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── JWT Config ───────────────────────────────────────────────────────────────
SECRET_KEY = "cloudops-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

FAKE_USERS = {
    "admin@cloudops.io": {"id": 1, "name": "Alex Chen", "role": "admin", "password": "admin123"},
    "viewer@cloudops.io": {"id": 2, "name": "Sam Rivera", "role": "viewer", "password": "viewer123"},
}

# ─── Models ───────────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ServerCreate(BaseModel):
    name: str
    ip: str
    region: str
    os: str

class AlertCreate(BaseModel):
    level: str
    title: str
    description: str
    server: str

# ─── Auth Helpers ─────────────────────────────────────────────────────────────
def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email not in FAKE_USERS:
            raise HTTPException(status_code=401, detail="Invalid token")
        return FAKE_USERS[email]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─── Auth Routes ──────────────────────────────────────────────────────────────
@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = FAKE_USERS.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": form_data.username, "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": {k: v for k, v in user.items() if k != "password"}}

# ─── Servers ──────────────────────────────────────────────────────────────────
SERVERS = [
    {"id": 1, "name": "prod-web-01", "ip": "10.0.1.10", "region": "us-east-1", "status": "online", "os": "Ubuntu 22.04 LTS", "tags": ["production", "web"]},
    {"id": 2, "name": "prod-api-02", "ip": "10.0.1.11", "region": "us-east-1", "status": "warning", "os": "Ubuntu 22.04 LTS", "tags": ["production", "api"]},
    {"id": 3, "name": "prod-db-01", "ip": "10.0.2.5", "region": "us-east-1", "status": "online", "os": "CentOS 8", "tags": ["production", "database"]},
    {"id": 4, "name": "staging-01", "ip": "10.0.3.20", "region": "us-west-2", "status": "offline", "os": "Ubuntu 20.04 LTS", "tags": ["staging"]},
]

@app.get("/api/servers")
async def get_servers(current_user=Depends(get_current_user)):
    return {"servers": SERVERS, "total": len(SERVERS)}

@app.get("/api/servers/{server_id}")
async def get_server(server_id: int, current_user=Depends(get_current_user)):
    server = next((s for s in SERVERS if s["id"] == server_id), None)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server

@app.get("/api/servers/{server_id}/metrics")
async def get_server_metrics(server_id: int, current_user=Depends(get_current_user)):
    """Returns real system metrics using psutil (simulated per server)"""
    server = next((s for s in SERVERS if s["id"] == server_id), None)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    if server["status"] == "offline":
        return {"status": "offline", "cpu": 0, "memory": 0, "disk": 0, "network": {"in": 0, "out": 0}}
    
    # For local server, use real psutil; for others, simulate
    if server_id == 1:
        cpu = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        net = psutil.net_io_counters()
        return {
            "cpu": round(cpu, 1),
            "memory": round(memory, 1),
            "disk": round(disk, 1),
            "network": {"in": round(net.bytes_recv / 1024 / 1024, 2), "out": round(net.bytes_sent / 1024 / 1024, 2)},
            "timestamp": datetime.utcnow().isoformat(),
        }
    else:
        # Simulated data for demo
        base_cpu = {2: 87, 3: 34, 4: 0}.get(server_id, 50)
        return {
            "cpu": round(max(0, min(100, base_cpu + random.gauss(0, 5))), 1),
            "memory": round(max(0, min(100, random.uniform(50, 90))), 1),
            "disk": round(max(0, min(100, random.uniform(40, 95))), 1),
            "network": {"in": round(random.uniform(1, 50), 2), "out": round(random.uniform(1, 25), 2)},
            "timestamp": datetime.utcnow().isoformat(),
        }

@app.get("/api/servers/{server_id}/status")
async def get_server_status(server_id: int, current_user=Depends(get_current_user)):
    server = next((s for s in SERVERS if s["id"] == server_id), None)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return {"id": server_id, "status": server["status"], "checked_at": datetime.utcnow().isoformat()}

@app.post("/api/servers", status_code=201)
async def create_server(server: ServerCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    new_server = {"id": len(SERVERS) + 1, **server.dict(), "status": "online", "tags": []}
    SERVERS.append(new_server)
    return new_server

# ─── Docker ───────────────────────────────────────────────────────────────────
CONTAINERS = [
    {"id": "c1", "name": "nginx-proxy", "image": "nginx:1.25", "status": "running", "cpu": 3.2, "memory": 128, "server": "prod-web-01"},
    {"id": "c2", "name": "backend-api", "image": "myapp/backend:v2.4.1", "status": "running", "cpu": 12.8, "memory": 512, "server": "prod-api-02"},
    {"id": "c3", "name": "postgres-db", "image": "postgres:15", "status": "running", "cpu": 8.1, "memory": 768, "server": "prod-db-01"},
    {"id": "c4", "name": "redis-cache", "image": "redis:7-alpine", "status": "stopped", "cpu": 0, "memory": 0, "server": "prod-api-02"},
]

@app.get("/api/docker")
async def get_docker_overview(current_user=Depends(get_current_user)):
    return {
        "total": len(CONTAINERS),
        "running": sum(1 for c in CONTAINERS if c["status"] == "running"),
        "stopped": sum(1 for c in CONTAINERS if c["status"] == "stopped"),
    }

@app.get("/api/docker/containers")
async def get_containers(current_user=Depends(get_current_user)):
    return {"containers": CONTAINERS}

# ─── Alerts ───────────────────────────────────────────────────────────────────
ALERTS = [
    {"id": "a1", "level": "critical", "title": "Disk Space Critical", "description": "prod-db-01 disk at 91%", "server": "prod-db-01", "acknowledged": False, "created_at": "2026-10-20T02:05:14"},
    {"id": "a2", "level": "warning", "title": "High CPU Usage", "description": "prod-api-02 CPU at 87%", "server": "prod-api-02", "acknowledged": False, "created_at": "2026-10-20T02:01:22"},
    {"id": "a3", "level": "critical", "title": "Server Offline", "description": "staging-01 unreachable", "server": "staging-01", "acknowledged": False, "created_at": "2026-10-20T01:48:33"},
]

@app.get("/api/alerts")
async def get_alerts(current_user=Depends(get_current_user)):
    return {"alerts": ALERTS, "active": sum(1 for a in ALERTS if not a["acknowledged"])}

@app.post("/api/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, current_user=Depends(get_current_user)):
    alert = next((a for a in ALERTS if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert["acknowledged"] = True
    return {"message": "Alert acknowledged", "alert": alert}

@app.post("/api/alerts", status_code=201)
async def create_alert(alert: AlertCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    new_alert = {"id": f"a{len(ALERTS)+1}", **alert.dict(), "acknowledged": False, "created_at": datetime.utcnow().isoformat()}
    ALERTS.append(new_alert)
    return new_alert

# ─── Logs ─────────────────────────────────────────────────────────────────────
@app.get("/api/logs")
async def get_logs(
    level: Optional[str] = None,
    server: Optional[str] = None,
    limit: int = 50,
    current_user=Depends(get_current_user)
):
    sample_logs = [
        {"id": f"l{i}", "timestamp": f"2026-10-20 02:{str(i).zfill(2)}:00",
         "level": random.choice(["INFO", "INFO", "INFO", "WARN", "ERROR"]),
         "message": f"System log entry {i}", "server": random.choice(["prod-web-01", "prod-api-02", "prod-db-01"])}
        for i in range(1, 21)
    ]
    if level:
        sample_logs = [l for l in sample_logs if l["level"] == level]
    if server:
        sample_logs = [l for l in sample_logs if l["server"] == server]
    return {"logs": sample_logs[:limit], "total": len(sample_logs)}

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {"api": "up", "database": "up", "agent": "up"},
    }

@app.get("/")
async def root():
    return {"message": "CloudOps Monitor API v2.0", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
