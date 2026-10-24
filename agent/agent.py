#!/usr/bin/env python3
"""
CloudOps Monitoring Agent
Collects system metrics using psutil and sends to CloudOps API.
Run on any server you want to monitor.

Usage:
    pip install psutil requests
    python agent.py --server-id 1 --api-url http://localhost:8000 --interval 60
"""
import psutil
import requests
import time
import argparse
import logging
import json
from datetime import datetime
import platform

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('cloudops-agent.log'),
    ]
)
logger = logging.getLogger(__name__)


def collect_metrics():
    """Collect system metrics using psutil"""
    # CPU
    cpu = psutil.cpu_percent(interval=1)
    cpu_per_core = psutil.cpu_percent(percpu=True)
    
    # Memory
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    # Disk
    disk = psutil.disk_usage('/')
    disk_io = psutil.disk_io_counters()
    
    # Network
    net = psutil.net_io_counters()
    
    # Processes
    processes = len(psutil.pids())
    
    # System
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "hostname": platform.node(),
        "os": f"{platform.system()} {platform.release()}",
        "cpu": {
            "percent": round(cpu, 1),
            "per_core": [round(c, 1) for c in cpu_per_core],
            "count": psutil.cpu_count(),
        },
        "memory": {
            "percent": round(mem.percent, 1),
            "total_gb": round(mem.total / (1024**3), 2),
            "used_gb": round(mem.used / (1024**3), 2),
            "available_gb": round(mem.available / (1024**3), 2),
        },
        "swap": {
            "percent": round(swap.percent, 1),
            "total_gb": round(swap.total / (1024**3), 2),
        },
        "disk": {
            "percent": round(disk.percent, 1),
            "total_gb": round(disk.total / (1024**3), 2),
            "used_gb": round(disk.used / (1024**3), 2),
            "free_gb": round(disk.free / (1024**3), 2),
        },
        "network": {
            "bytes_sent_mb": round(net.bytes_sent / (1024**2), 2),
            "bytes_recv_mb": round(net.bytes_recv / (1024**2), 2),
            "packets_sent": net.packets_sent,
            "packets_recv": net.packets_recv,
        },
        "system": {
            "processes": processes,
            "uptime_seconds": int(uptime_seconds),
            "boot_time": datetime.fromtimestamp(boot_time).isoformat(),
        }
    }


def collect_docker_metrics():
    """Collect Docker container metrics"""
    try:
        import docker
        client = docker.from_env()
        containers = []
        for container in client.containers.list(all=True):
            info = {
                "id": container.short_id,
                "name": container.name,
                "image": container.image.tags[0] if container.image.tags else "unknown",
                "status": container.status,
                "cpu": 0,
                "memory_mb": 0,
            }
            if container.status == "running":
                try:
                    stats = container.stats(stream=False)
                    cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
                    system_delta = stats["cpu_stats"]["system_cpu_usage"] - stats["precpu_stats"]["system_cpu_usage"]
                    num_cpus = len(stats["cpu_stats"]["cpu_usage"].get("percpu_usage", [1]))
                    if system_delta > 0:
                        info["cpu"] = round((cpu_delta / system_delta) * num_cpus * 100, 2)
                    mem = stats["memory_stats"]
                    info["memory_mb"] = round(mem.get("usage", 0) / (1024**2), 1)
                except Exception:
                    pass
            containers.append(info)
        return containers
    except ImportError:
        logger.warning("Docker SDK not installed. Skipping Docker metrics.")
        return []
    except Exception as e:
        logger.warning(f"Could not connect to Docker: {e}")
        return []


def send_metrics(api_url, server_id, token, metrics, docker_metrics):
    """Send metrics to CloudOps API"""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "server_id": server_id,
        "metrics": metrics,
        "docker": docker_metrics,
    }
    try:
        resp = requests.post(f"{api_url}/api/servers/{server_id}/metrics/push", json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        logger.info(f"✅ Metrics sent: CPU={metrics['cpu']['percent']}%, RAM={metrics['memory']['percent']}%, Disk={metrics['disk']['percent']}%")
    except Exception as e:
        logger.error(f"❌ Failed to send metrics: {e}")


def get_token(api_url, email, password):
    """Authenticate with CloudOps API"""
    try:
        resp = requests.post(f"{api_url}/api/auth/login", data={"username": email, "password": password}, timeout=10)
        resp.raise_for_status()
        return resp.json()["access_token"]
    except Exception as e:
        logger.error(f"Authentication failed: {e}")
        return None


def run_agent(api_url, server_id, email, password, interval):
    logger.info(f"🚀 CloudOps Agent starting...")
    logger.info(f"   Server ID: {server_id}")
    logger.info(f"   API URL: {api_url}")
    logger.info(f"   Interval: {interval}s")

    token = get_token(api_url, email, password)
    if not token:
        logger.error("Could not authenticate. Check credentials.")
        return

    logger.info("✅ Authenticated successfully")

    while True:
        try:
            metrics = collect_metrics()
            docker_metrics = collect_docker_metrics()
            
            # Print to console
            logger.info(f"Metrics: CPU={metrics['cpu']['percent']}% | RAM={metrics['memory']['percent']}% | "
                       f"Disk={metrics['disk']['percent']}% | Processes={metrics['system']['processes']}")
            
            if docker_metrics:
                running = sum(1 for c in docker_metrics if c["status"] == "running")
                logger.info(f"Docker: {running}/{len(docker_metrics)} containers running")
            
            send_metrics(api_url, server_id, token, metrics, docker_metrics)
            
        except KeyboardInterrupt:
            logger.info("Agent stopped by user.")
            break
        except Exception as e:
            logger.error(f"Error collecting metrics: {e}")
        
        time.sleep(interval)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CloudOps Monitoring Agent")
    parser.add_argument("--server-id", type=int, default=1, help="Server ID registered in CloudOps")
    parser.add_argument("--api-url", default="http://localhost:8000", help="CloudOps API URL")
    parser.add_argument("--email", default="admin@cloudops.io", help="API username/email")
    parser.add_argument("--password", default="admin123", help="API password")
    parser.add_argument("--interval", type=int, default=60, help="Collection interval in seconds")
    args = parser.parse_args()
    
    run_agent(args.api_url, args.server_id, args.email, args.password, args.interval)
