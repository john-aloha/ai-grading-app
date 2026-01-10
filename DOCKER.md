# Docker Deployment Guide

This guide explains how to deploy the AI Grading App using Docker and Docker Compose. The containerized setup provides complete isolation, easy deployment, and scalability.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment Options](#deployment-options)
- [Production Deployment](#production-deployment)
- [Management Commands](#management-commands)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Prerequisites

### Required Software

1. **Docker** (version 20.10 or higher)
   ```bash
   # Install Docker on Ubuntu
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Add your user to docker group (logout/login required)
   sudo usermod -aG docker $USER
   ```

2. **Docker Compose** (version 2.0 or higher)
   ```bash
   # Docker Compose is included with Docker Desktop
   # For Linux servers, it's installed with Docker Engine
   docker compose version
   ```

3. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Generate an API key from the dashboard

---

## Quick Start

### 1. Clone and Configure

```bash
# Navigate to the project directory
cd ai-grading-app

# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
nano .env
# or
vim .env
```

### 2. Set Environment Variables

Edit `.env` file:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Build and Start

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### 5. Stop the Application

```bash
# Stop all services
docker compose down

# Stop and remove volumes (caution: deletes database and uploads)
docker compose down -v
```

---

## Configuration

### Environment Variables

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for grading | `sk-...` |
| `OPENAI_MODEL` | GPT model to use | `gpt-4o` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | Database file path | `file:/app/data/database.db` |

### Updating Configuration

1. Edit `.env` file
2. Restart containers:
   ```bash
   docker compose down
   docker compose up -d
   ```

---

## Deployment Options

### Option 1: Development Mode (Local Testing)

```bash
# Use the default configuration
docker compose up -d
```

Access via:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Option 2: Production Mode (With Nginx)

```bash
# Start with nginx reverse proxy
docker compose --profile production up -d
```

Access via:
- Application: http://your-server-ip (port 80)
- HTTPS: Configure SSL certificates (see Production Deployment)

### Option 3: Custom Ports

Edit `docker-compose.yml` to change ports:

```yaml
services:
  client:
    ports:
      - "8080:3000"  # Custom port mapping

  server:
    ports:
      - "8081:3001"  # Custom port mapping
```

---

## Production Deployment

### Step 1: Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y
```

### Step 2: Configure Environment

```bash
# Clone repository
git clone <your-repo-url> ai-grading-app
cd ai-grading-app

# Set up environment
cp .env.example .env
nano .env  # Add your production values
```

**Production `.env` example:**

```env
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4o
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Step 3: SSL Configuration (Optional but Recommended)

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem

# Or copy your real SSL certificates
cp /path/to/your/cert.pem nginx/ssl/cert.pem
cp /path/to/your/key.pem nginx/ssl/key.pem
```

Edit `nginx/nginx.conf` and uncomment the HTTPS server block.

### Step 4: Deploy with Nginx

```bash
# Build and start with production profile
docker compose --profile production up -d --build

# Verify all services are running
docker compose ps
```

### Step 5: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Step 6: Set Up Auto-Start

```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Containers will auto-restart with the server due to "restart: unless-stopped"
```

---

## Management Commands

### Viewing Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs -f server
docker compose logs -f client
docker compose logs -f nginx

# View last 100 lines
docker compose logs --tail=100
```

### Rebuilding Containers

```bash
# Rebuild after code changes
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build server
```

### Database Management

```bash
# Access server container
docker compose exec server sh

# Inside container, run Prisma commands
npx prisma studio  # Open Prisma Studio
npx prisma migrate deploy  # Run migrations
npx prisma migrate reset  # Reset database (caution!)

# Exit container
exit
```

### Backup and Restore

```bash
# Backup database
docker compose exec server tar -czf /tmp/backup.tar.gz /app/data /app/uploads
docker compose cp server:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz

# Restore database
docker compose cp ./backup-20260110.tar.gz server:/tmp/backup.tar.gz
docker compose exec server tar -xzf /tmp/backup.tar.gz -C /
docker compose restart server
```

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build

# Or zero-downtime update (requires load balancer)
docker compose up -d --build --no-deps client
docker compose up -d --build --no-deps server
```

### Monitoring Resources

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker compose ps

# View logs for errors
docker compose logs server
docker compose logs client

# Restart specific service
docker compose restart server
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d

# Or manually reset
docker compose exec server npx prisma migrate reset
```

### Port Conflicts

```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :80

# Kill the process or change ports in docker-compose.yml
```

### Permission Issues

```bash
# Fix volume permissions
docker compose down
sudo chown -R $(id -u):$(id -g) ./

# Restart
docker compose up -d
```

### Network Issues

```bash
# Recreate network
docker compose down
docker network prune
docker compose up -d

# Check network connectivity
docker compose exec server ping client
docker compose exec client ping server
```

### Out of Disk Space

```bash
# Remove unused images and containers
docker system prune -a

# Remove old volumes (caution: may delete data)
docker volume prune
```

### Health Check Failures

```bash
# Check health status
docker compose ps

# Test health endpoints manually
curl http://localhost:3001/api/health
curl http://localhost:3000/

# View health check logs
docker inspect --format='{{json .State.Health}}' ai-grading-server
```

---

## Architecture

### Container Structure

```
┌─────────────────────────────────────────────┐
│              Nginx (Optional)               │
│         Reverse Proxy (Port 80/443)         │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│   Client    │  │    Server    │
│  (Next.js)  │  │  (Express)   │
│  Port 3000  │  │  Port 3001   │
└─────────────┘  └──────┬───────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  SQLite DB  │
                 │  (Volume)   │
                 └─────────────┘
```

### Volumes

- **server-data**: Persistent SQLite database storage
- **server-uploads**: Persistent file uploads storage

### Networks

- **ai-grading-network**: Bridge network for inter-container communication

### Health Checks

All services include health checks:
- **Server**: Checks `/api/health` endpoint every 30s
- **Client**: Checks homepage every 30s
- **Nginx**: Inherits from upstream services

---

## Running Alongside Other Apps

Docker containers are **completely isolated**, so you can safely run this alongside other applications:

### Using Different Ports

Edit `docker-compose.yml`:

```yaml
services:
  client:
    ports:
      - "3010:3000"  # Use port 3010 instead

  server:
    ports:
      - "3011:3001"  # Use port 3011 instead
```

### Using Nginx for Multiple Apps

If you already have Nginx running, you can:

1. **Option A**: Skip the nginx service
   ```bash
   docker compose up -d client server
   ```

2. **Option B**: Configure existing Nginx
   Add this to your existing Nginx config:
   ```nginx
   location /grading/ {
       proxy_pass http://localhost:3000/;
   }

   location /grading/api/ {
       proxy_pass http://localhost:3001/api/;
   }
   ```

### Domain-Based Routing

Use different domains for each app:
```nginx
server {
    server_name grading.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}

server {
    server_name other-app.yourdomain.com;
    location / {
        proxy_pass http://localhost:4000;
    }
}
```

---

## Security Best Practices

1. **Use Strong Secrets**
   - Never commit `.env` to version control
   - Use strong, unique API keys

2. **Enable HTTPS**
   - Always use SSL in production
   - Use Let's Encrypt for free certificates

3. **Regular Updates**
   ```bash
   # Update base images
   docker compose pull
   docker compose up -d --build
   ```

4. **Limit Exposure**
   ```bash
   # Only expose necessary ports
   # Consider using internal networks for server
   ```

5. **Monitor Logs**
   ```bash
   # Regularly check for suspicious activity
   docker compose logs --tail=1000 | grep -i error
   ```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

---

## Getting Help

If you encounter issues:

1. Check the logs: `docker compose logs -f`
2. Review this troubleshooting section
3. Check Docker and Docker Compose versions
4. Verify environment variables in `.env`
5. Ensure ports aren't already in use

For additional support, refer to the main README.md file.
