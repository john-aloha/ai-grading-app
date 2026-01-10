# Nginx Configuration

This directory contains Nginx configuration for the AI Grading App Docker deployment.

## Files

- `nginx.conf` - Main Nginx configuration file
- `ssl/` - SSL certificate directory (create if using HTTPS)

## SSL Setup

### Option 1: Self-Signed Certificate (Development/Testing)

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem
```

### Option 2: Let's Encrypt (Production)

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### Option 3: Existing Certificates

```bash
# Copy your existing certificates
cp /path/to/your/cert.pem ssl/cert.pem
cp /path/to/your/key.pem ssl/key.pem
```

## Enabling HTTPS

After setting up SSL certificates:

1. Edit `nginx.conf`
2. Uncomment the HTTPS server block (lines starting with #)
3. Update `server_name` with your domain
4. Restart Docker Compose:
   ```bash
   docker compose --profile production restart nginx
   ```

## Configuration

The default configuration:

- Routes `/api/*` requests to the backend server (port 3001)
- Routes all other requests to the Next.js client (port 3000)
- Enables gzip compression
- Sets max upload size to 100MB
- Configures appropriate headers and timeouts

## Custom Configuration

To modify the configuration:

1. Edit `nginx.conf`
2. Restart Nginx:
   ```bash
   docker compose --profile production restart nginx
   ```

## Testing Configuration

```bash
# Test configuration syntax
docker compose --profile production exec nginx nginx -t

# Reload configuration without downtime
docker compose --profile production exec nginx nginx -s reload
```
