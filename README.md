# 🎓 AI Grading App

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-95.5%25-blue?style=flat-square&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-5-green?style=flat-square&logo=express)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5.2-412991?style=flat-square&logo=openai)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**AI-powered grading application for educators — automates assignment grading using GPT-5.2**

[Getting Started](#-getting-started) •
[User Guide](#-user-guide) •
[Admin Guide](#-administrator-guide) •
[API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [User Guide](#-user-guide)
- [Administrator Guide](#-administrator-guide)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The AI Grading App is a full-stack web application that helps educators save time by automating the grading process. Upload student submissions, define your rubric, and receive detailed, fair, and consistent grades in seconds.

### Why AI Grading App?

- ⏱️ **Save Time** — Grade entire classes in minutes, not hours
- 📊 **Consistency** — Every student receives fair, unbiased evaluation
- 📝 **Detailed Feedback** — AI provides constructive, personalized feedback
- 🎯 **Customizable** — Set strictness levels and custom rubrics
- 📁 **Batch Processing** — Upload ZIP files with multiple submissions

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Job Management** | Create grading jobs with custom settings |
| **Multi-Format Support** | PDF, DOCX, and TXT files supported |
| **Batch Upload** | ZIP file support for bulk submissions |
| **AI Grading** | GPT-5.2 powered intelligent grading |
| **Strictness Levels** | Lenient, Normal, or Strict grading |
| **Custom Rubrics** | Define your own or let AI generate one |
| **Real-time Status** | Track grading progress live |
| **Detailed Results** | Score, feedback, and rubric breakdown |

---

## 🚀 Getting Started

### Deployment Options

**Choose your deployment method:**

- **🐳 Docker (Recommended)** — Fully containerized, isolated, production-ready
- **💻 Local Development** — Direct installation for development and testing

---

### Option 1: Docker Deployment (Recommended)

**Perfect for production servers running multiple apps**

```bash
# Clone the repository
git clone https://github.com/john-aloha/ai-grading-app.git
cd ai-grading-app

# Configure environment
cp .env.example .env
nano .env  # Add your OpenAI API key

# Build and start with Docker Compose
docker compose up -d

# View logs
docker compose logs -f
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**For detailed Docker instructions, SSL setup, and production deployment, see [DOCKER.md](DOCKER.md)**

---

### Option 2: Local Development

**For development and testing without Docker**

```bash
# Clone the repository
git clone https://github.com/john-aloha/ai-grading-app.git
cd ai-grading-app

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up the database
cd ../server
npx prisma generate
npx prisma migrate dev

# Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Start development servers
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 User Guide

### For Educators & End Users

#### 1. Creating a Grading Job

A **Grading Job** is a container for all submissions of a single assignment.

1. Navigate to the **Dashboard**
2. Click **"Create New Job"**
3. Fill in the job details:

| Field | Description | Required |
|-------|-------------|----------|
| **Title** | Name of the assignment (e.g., "Essay 1 - Climate Change") | ✅ |
| **Total Points** | Maximum score possible (e.g., 100) | ✅ |
| **Strictness** | How strictly to grade: Lenient, Normal, or Strict | ✅ |
| **Instructions** | The assignment prompt/instructions given to students | ✅ |
| **Rubric** | Optional grading criteria (AI generates if not provided) | ❌ |

4. Click **"Create Job"**

#### 2. Understanding Strictness Levels

| Level | Description | Best For |
|-------|-------------|----------|
| 🟢 **Lenient** | Generous interpretation, focuses on effort and main ideas | First drafts, learning exercises |
| 🟡 **Normal** | Balanced grading aligned with standard expectations | Regular assignments |
| 🔴 **Strict** | Rigorous evaluation, high attention to detail | Final submissions, advanced courses |

#### 3. Uploading Submissions

You have two options for uploading student work:

**Option A: Individual Files**
- Click **"Upload Submission"**
- Select a PDF, DOCX, or TXT file
- Enter the student's name
- Click **"Upload"**

**Option B: Batch Upload (ZIP)**
- Create a ZIP file containing all student submissions
- Name each file as `StudentName.pdf` (or .docx/.txt)
- Click **"Batch Upload"**
- Select your ZIP file
- The system automatically extracts and names submissions

#### 4. Starting the Grading Process

1. Review all uploaded submissions in the job view
2. Ensure all submissions show status: **PENDING**
3. Click **"Start Grading"**
4. Wait for AI to process each submission
5. Status will change: PENDING → GRADING → GRADED

> ⏱️ **Processing Time**: Approximately 10-30 seconds per submission

#### 5. Reviewing Results

Once grading is complete, view results for each submission:

| Field | Description |
|-------|-------------|
| **Score** | Points earned (e.g., 85/100) |
| **Feedback** | Detailed comments for the student |
| **Rubric Breakdown** | How points were allocated per criterion |

#### 6. Exporting Grades

*(Coming Soon)*

- Export to CSV for spreadsheet import
- Export to Excel format
- Bulk download feedback documents

---

## 🔧 Administrator Guide

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 2 GB | 4+ GB |
| **Storage** | 10 GB | 50+ GB |
| **OS** | Ubuntu 20.04+ | Ubuntu 22.04 LTS |
| **Node.js** | 18.x | 20.x LTS |

### Production Installation on Ubuntu Server 22.04

Follow these steps to deploy the AI Grading App on a fresh Ubuntu Server 22.04 installation.

#### Step 1: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Node.js 20.x LTS

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### Step 3: Install Build Tools

```bash
sudo apt install -y build-essential git
```

#### Step 4: Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/john-aloha/ai-grading-app.git
sudo chown -R $USER:$USER ai-grading-app
cd ai-grading-app
```

#### Step 5: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### Step 6: Configure Environment Variables

```bash
cd /opt/ai-grading-app/server

# Create environment file
cat > .env << EOF
# Database
DATABASE_URL="file:./prod.db"

# OpenAI Configuration
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server Configuration
PORT=3001
NODE_ENV=production
EOF
```

> ⚠️ **Important**: Replace `sk-your-openai-api-key-here` with your actual OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

#### Step 7: Initialize Database

```bash
cd /opt/ai-grading-app/server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify database
npx prisma db push
```

#### Step 8: Build Applications

```bash
# Build backend
cd /opt/ai-grading-app/server
npm run build

# Build frontend
cd /opt/ai-grading-app/client
npm run build
```

#### Step 9: Install PM2 Process Manager

```bash
sudo npm install -g pm2

# Create PM2 ecosystem file
cd /opt/ai-grading-app
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ai-grading-server',
      cwd: '/opt/ai-grading-app/server',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'ai-grading-client',
      cwd: '/opt/ai-grading-app/client',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF
```

#### Step 10: Start Applications

```bash
cd /opt/ai-grading-app

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Configure PM2 to start on boot
pm2 startup systemd -u $USER --hp /home/$USER
# Run the command that PM2 outputs
```

#### Step 11: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/ai-grading-app << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for AI processing
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
    }

    # File upload size limit
    client_max_body_size 50M;
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/ai-grading-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 12: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

#### Step 13: (Optional) Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

### Verification

After completing installation:

```bash
# Check service status
pm2 status

# View logs
pm2 logs ai-grading-server
pm2 logs ai-grading-client

# Test health endpoint
curl http://localhost:3001/api/health
```

Expected health response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-10T09:30:00.000Z"
}
```

### Maintenance Commands

| Command | Description |
|---------|-------------|
| `pm2 status` | View application status |
| `pm2 logs` | View all logs |
| `pm2 restart all` | Restart all applications |
| `pm2 stop all` | Stop all applications |
| `pm2 monit` | Real-time monitoring dashboard |

### Backup & Restore

#### Backup Database

```bash
# Create backup
cp /opt/ai-grading-app/server/prisma/prod.db /backups/prod-$(date +%Y%m%d).db
```

#### Restore Database

```bash
# Stop applications
pm2 stop all

# Restore backup
cp /backups/prod-20260110.db /opt/ai-grading-app/server/prisma/prod.db

# Restart applications
pm2 restart all
```

### Updating the Application

```bash
cd /opt/ai-grading-app

# Pull latest changes
git pull origin main

# Update dependencies
cd server && npm install
cd ../client && npm install

# Rebuild
cd ../server && npm run build
cd ../client && npm run build

# Run any new migrations
cd ../server && npx prisma migrate deploy

# Restart applications
pm2 restart all
```

---

## 📡 API Reference

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-10T09:30:00.000Z"
}
```

#### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all grading jobs |
| `POST` | `/api/jobs` | Create a new job |
| `GET` | `/api/jobs/:id` | Get job details |
| `PUT` | `/api/jobs/:id` | Update a job |
| `DELETE` | `/api/jobs/:id` | Delete a job |

**Create Job Request:**
```json
{
  "title": "Essay 1 - Climate Change",
  "total_points": 100,
  "strictness": "NORMAL",
  "assignment_instructions_text": "Write a 500-word essay...",
  "rubric_text": "Optional custom rubric..."
}
```

#### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/submissions` | Upload submission(s) |
| `GET` | `/api/submissions/:jobId` | Get submissions for job |
| `POST` | `/api/submissions/:jobId/grade` | Start grading |

---

## 🔍 Troubleshooting

### Common Issues

#### "OpenAI API Key Invalid"
```bash
# Check your API key is set correctly
cat /opt/ai-grading-app/server/.env | grep OPENAI

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### "Database Connection Failed"
```bash
# Check database file exists
ls -la /opt/ai-grading-app/server/prisma/*.db

# Re-run migrations
cd /opt/ai-grading-app/server
npx prisma migrate deploy
```

#### "File Upload Failed"
```bash
# Check upload directory permissions
ls -la /opt/ai-grading-app/server/uploads/

# Fix permissions
sudo chown -R $USER:$USER /opt/ai-grading-app/server/uploads/
chmod 755 /opt/ai-grading-app/server/uploads/
```

#### "502 Bad Gateway"
```bash
# Check if applications are running
pm2 status

# Check logs for errors
pm2 logs --lines 50

# Restart if needed
pm2 restart all
```

### Getting Help

- 📖 Check the [WALKTHROUGH.md](./WALKTHROUGH.md) for codebase details
- 📋 Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for project status
- 🐛 Open an issue on [GitHub Issues](https://github.com/john-aloha/ai-grading-app/issues)

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for Educators**

[⬆ Back to Top](#-ai-grading-app)

</div>
