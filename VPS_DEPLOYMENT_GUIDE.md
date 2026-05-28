# 🏔️ Fort Tracker - Production VPS Deployment Handbook (Manual Hosting)

This guide outlines the exact, step-by-step process to deploy the **Fort Tracker** application to your Virtual Private Server (VPS) under the domain **`nomadtrekkers.org`** using a native hosting stack (**Node.js**, **PM2**, **Nginx**, and **Certbot SSL**).

---

## 🗺️ Phase 1: DNS & Domain Setup

Configure your domain's DNS records at your domain registrar (GoDaddy, Namecheap, Route 53, Cloudflare, etc.) to point to your VPS:

| Record Type | Name / Host | Value / Target | TTL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `YOUR_VPS_PUBLIC_IP` | Automatic / 3600 | Directs nomadtrekkers.org to your VPS |
| **CNAME** | `www` | `nomadtrekkers.org` | Automatic / 3600 | Aliases www.nomadtrekkers.org |

> [!NOTE]
> DNS propagation can take anywhere from a few minutes up to 24–48 hours. You can verify it by running `ping nomadtrekkers.org` from your local terminal.

---

## 🛠️ Phase 2: Server Setup & Configuration

Log into your VPS via SSH as the `root` or a `sudo` user:

```bash
ssh username@YOUR_VPS_PUBLIC_IP
```

### 1. System Preparation & Package Updates
Update system packages and install git, Nginx, build-essential, and Certbot for SSL:

```bash
# Update package repositories
sudo apt update && sudo apt upgrade -y

# Install build dependencies and web server packages
sudo apt install -y git curl build-essential certbot python3-certbot-nginx nginx mysql-server
```

### 2. Node.js Environment Setup
We will install Node.js 22 using NVM (Node Version Manager) to match the project's build targets:

```bash
# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into current terminal session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify installations
node -v
npm -v
```

### 3. Deploy the Application Code
Clone your repository to `/var/www/nomadtrekkers` (or transfer files via SFTP):

```bash
# Create directory and set permissions
sudo mkdir -p /var/www/nomadtrekkers
sudo chown -R $USER:$USER /var/www/nomadtrekkers

# Clone the project code
cd /var/www
git clone https://github.com/your-username/forttracker.git nomadtrekkers
cd nomadtrekkers

# Install NPM dependencies
npm install
```

### 4. How to Check for and Choose an Unused Port on Your VPS
Before starting the app, verify if your chosen port is already in use by another application.

Run this command on your VPS:
```bash
sudo ss -tulpn | grep LISTEN
```
Alternatively, use:
```bash
sudo lsof -i -P -n | grep LISTEN
```

- **Port `3001` is currently occupied** on this server by another Node process (`pid 1336509`).
- We will therefore configure our app to run on **`3005`** which is completely unused and safe to use!

---

### 5. Configure Production Environment Variables
Create a production `.env` file in the project root:

```bash
nano .env
```

Paste your production secrets and database configuration, setting the `PORT` to the unused port **`3005`**:

```env
# MySQL Database Configuration
# Set to 'localhost' if running MySQL on this VPS, or keep your remote host
DB_HOST=localhost
DB_PORT=3306
DB_USER=u112524576_forttreaker
DB_PASSWORD=Forttreaker@2026
DB_NAME=u112524576_forttreaker

# Application Settings
NODE_ENV=production
PORT=3005 # <-- Set to 3005 since 3001 is already occupied on your server!

# JWT Security Signature (Generate a secure, random key)
JWT_SECRET=your-production-secret-key-change-this
```

> [!IMPORTANT]
> **If you ever need to change the port in `.env` (e.g. to `3010`)**:
> You **MUST** also change the port in the Nginx configuration file! In `/etc/nginx/sites-available/nomadtrekkers`, replace all occurrences of `http://127.0.0.1:3005` with your chosen port.

---

### 6. Build and Compile
Compile the React SPA and bundle the Express server for production:

```bash
# Run production build compilation
npm run build
```

---

## 🚀 Phase 3: Process Management (PM2)

PM2 keeps your Express server running continuously in the background, handles logs, and restarts the app if the VPS reboots.

```bash
# Install PM2 globally
npm install -g pm2

# Start your production server
pm2 start dist/server/node-build.mjs --name nomadtrekkers

# Configure PM2 to start on system boot
pm2 startup

# IMPORTANT: Copy and run the exact command printed on screen by the previous command.
# For example: sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.0.0/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save the current PM2 state
pm2 save
```

### PM2 Monitoring Commands:
```bash
pm2 status       # Check status of the running app
pm2 logs         # View real-time application logs
pm2 restart all  # Restart the application
```

---

## 🔒 Phase 4: Nginx Reverse Proxy & SSL (HTTPS) Setup

Now Nginx will route incoming internet traffic from `nomadtrekkers.org` (port 80/443) to your PM2 process on port `3005`.

### 1. Register Nginx Configuration
Create Nginx site configuration file:

```bash
sudo nano /etc/nginx/sites-available/nomadtrekkers
```

Paste the following Nginx template:

```nginx
# HTTP - Redirect all traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name nomadtrekkers.org www.nomadtrekkers.org;

    # Certbot ACME challenge folder
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other requests to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Web Server proxying to PM2
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nomadtrekkers.org www.nomadtrekkers.org;

    # Maximum file upload size (5MB+)
    client_max_body_size 10M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss image/svg+xml;

    # Reverse Proxy configuration
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSockets support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # Static Assets Caching (Vite assets)
    location ~* ^/assets/ {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        access_log off;
    }

    # Uploads directory Caching
    location ~* ^/uploads/ {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        expires 1m;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
}
```

### 2. Enable and Verify Site
```bash
# Enable the configuration by creating a symlink
sudo ln -s /etc/nginx/sites-available/nomadtrekkers /etc/nginx/sites-enabled/

# Disable default placeholder site to prevent conflict
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3. Generate Free Let's Encrypt SSL
Use Certbot to generate security certificates and automatically bind them to Nginx:

```bash
sudo certbot --nginx -d nomadtrekkers.org -d www.nomadtrekkers.org
```

Certbot will automatically verify ownership, edit your `/etc/nginx/sites-available/nomadtrekkers` file, install the SSL parameters, and reload Nginx.

---

## 💾 Phase 5: MySQL Setup (Optional)
If running a local database on the VPS:

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Log into MySQL CLI
sudo mysql -u root -p
```

Execute SQL commands:
```sql
CREATE DATABASE forttracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fortuser'@'localhost' IDENTIFIED BY 'production_password_change_me';
GRANT ALL PRIVILEGES ON forttracker.* TO 'fortuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Run database seed scripts to finalize tables:
```bash
npm run db:setup
```

---

🏔️ **Success!** Your app is now securely hosted at **[https://nomadtrekkers.org](https://nomadtrekkers.org)**!
