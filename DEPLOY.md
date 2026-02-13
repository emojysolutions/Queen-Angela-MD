# 🚀 Deployment Guide - Queen Angela MD

This guide covers deploying Queen Angela MD to various platforms.

## 📋 Table of Contents
- [BotHosting.net](#bothosting-net-primary)
- [Railway](#railway)
- [Render](#render)
- [Heroku](#heroku)
- [VPS with PM2](#vps-with-pm2)
- [Docker](#docker)

---

## 🎯 BotHosting.net (PRIMARY)

BotHosting.net is optimized for WhatsApp bots with 24/7 uptime and easy configuration.

### Step 1: Prepare Your Code

1. Push your code to GitHub
2. Ensure `.node-version` file exists with content: `18`
3. Verify `Procfile` exists with: `web: node index.js`

### Step 2: Create Account

1. Go to [BotHosting.net](https://bothosting.net)
2. Sign up for an account
3. Choose the Node.js plan

### Step 3: Deploy

1. **Connect Repository**
   - Click "New Project"
   - Select "Import from GitHub"
   - Choose `emojysolutions/Queen-Angela-MD`

2. **Configure Environment Variables**
   
   Navigate to Settings → Environment Variables and add:

   **Required:**
   ```
   WHATSAPP_TOKEN=your_whatsapp_access_token
   PHONE_NUMBER_ID=your_phone_number_id
   VERIFY_TOKEN=queen_angela_verify
   ```

   **Optional AI Services:**
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_AI_KEY=...
   DEEPSEEK_API_KEY=...
   ```

   **Admin:**
   ```
   ADMIN_PASSWORD=your_secure_password
   OWNER_NUMBER=+1234567890
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your bot will be running at: `https://your-app.bothosting.net`

### Step 4: Configure Webhook

1. Go to Facebook Developer Console
2. Navigate to WhatsApp → Configuration
3. Add webhook:
   - Callback URL: `https://your-app.bothosting.net/webhook`
   - Verify Token: `queen_angela_verify` (or your custom token)
   - Subscribe to: `messages`

4. Verify webhook
5. Test by sending a message!

---

## 🚂 Railway

Fast deployment with automatic SSL and preview environments.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Deploy

```bash
# From your project directory
railway init
railway up
```

### Step 4: Set Environment Variables

```bash
railway variables set WHATSAPP_TOKEN=your_token
railway variables set PHONE_NUMBER_ID=your_id
railway variables set VERIFY_TOKEN=queen_angela_verify
# Add more as needed
```

### Alternative: Web Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Add environment variables in Settings
6. Deploy!

Your app will be at: `https://your-app.railway.app`

---

## 🎨 Render

Free tier available with automatic deploys from GitHub.

### Step 1: Create Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** queen-angela-md
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`

### Step 3: Environment Variables

Add in the Environment section:

```
WHATSAPP_TOKEN
PHONE_NUMBER_ID
VERIFY_TOKEN
OPENAI_API_KEY (optional)
ANTHROPIC_API_KEY (optional)
GOOGLE_AI_KEY (optional)
DEEPSEEK_API_KEY (optional)
ADMIN_PASSWORD
OWNER_NUMBER
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

Your app will be at: `https://queen-angela-md.onrender.com`

### Alternative: render.yaml

The project includes `render.yaml` for automatic configuration:

1. Fork the repository
2. Connect to Render
3. Render will auto-detect `render.yaml`
4. Add environment variables
5. Deploy!

---

## 🟣 Heroku

Classic platform with easy scaling options.

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from heroku.com
```

### Step 2: Login

```bash
heroku login
```

### Step 3: Create App

```bash
heroku create queen-angela-md
```

### Step 4: Add Buildpacks

```bash
heroku buildpacks:add heroku/nodejs
```

### Step 5: Set Environment Variables

```bash
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set PHONE_NUMBER_ID=your_id
heroku config:set VERIFY_TOKEN=queen_angela_verify
# Add more as needed
```

### Step 6: Deploy

```bash
git push heroku main
```

### Step 7: Scale

```bash
heroku ps:scale web=1
```

Your app will be at: `https://queen-angela-md.herokuapp.com`

### View Logs

```bash
heroku logs --tail
```

---

## 🖥️ VPS with PM2

For full control on your own server (Ubuntu/Debian).

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install ffmpeg
sudo apt install -y ffmpeg

# Install PM2
sudo npm install -g pm2
```

### Step 2: Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/emojysolutions/Queen-Angela-MD.git
cd Queen-Angela-MD
sudo chown -R $USER:$USER .
```

### Step 3: Configure

```bash
npm install
cp .env.example .env
nano .env  # Edit with your values
```

### Step 4: Start with PM2

```bash
pm2 start pm2.config.js
pm2 save
pm2 startup  # Run the command it outputs
```

### Step 5: Setup Nginx (Optional)

```bash
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/queen-angela
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/queen-angela /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### PM2 Commands

```bash
pm2 status              # View status
pm2 logs queen-angela-md  # View logs
pm2 restart queen-angela-md  # Restart
pm2 stop queen-angela-md     # Stop
pm2 delete queen-angela-md   # Remove
```

---

## 🐳 Docker

Containerized deployment for consistency across environments.

### Step 1: Install Docker

```bash
# Ubuntu
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### Step 2: Build Image

```bash
docker build -t queen-angela-md .
```

### Step 3: Run Container

```bash
docker run -d \
  --name queen-angela-md \
  -p 3000:3000 \
  -e WHATSAPP_TOKEN=your_token \
  -e PHONE_NUMBER_ID=your_id \
  -e VERIFY_TOKEN=queen_angela_verify \
  queen-angela-md
```

### Or Use Docker Compose

```bash
# Create .env file first
docker-compose up -d
```

### Docker Commands

```bash
docker ps                        # List containers
docker logs queen-angela-md      # View logs
docker restart queen-angela-md   # Restart
docker stop queen-angela-md      # Stop
docker start queen-angela-md     # Start
```

---

## 🔧 Post-Deployment

### 1. Health Check

Visit: `https://your-app-url/health`

Should return:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "memory": { "used": 50, "total": 100 },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Configure WhatsApp Webhook

1. Go to [Facebook Developer Console](https://developers.facebook.com)
2. Select your app
3. WhatsApp → Configuration
4. Webhook:
   - URL: `https://your-app-url/webhook`
   - Verify Token: Your `VERIFY_TOKEN`
   - Subscribe to: `messages`

### 3. Test the Bot

Send a WhatsApp message:
```
!ping
```

Should respond with bot status and latency.

### 4. Monitor Logs

Check logs regularly to ensure smooth operation.

---

## 🆘 Troubleshooting

### Bot Not Responding

1. Check webhook is verified
2. Verify environment variables are set
3. Check application logs
4. Ensure WhatsApp token is valid

### Webhook Verification Failed

1. Verify VERIFY_TOKEN matches in:
   - .env file
   - Facebook Developer Console
2. Ensure app is running
3. Check URL is accessible

### Commands Not Working

1. Verify PREFIX in .env (default: `!`)
2. Check command files loaded: view startup logs
3. Test with `!ping` first

### AI Not Responding

1. Verify API keys are set correctly
2. Check API key validity
3. Monitor rate limits
4. View logs for specific errors

---

## 📊 Performance Tips

1. **Use CDN** for media files
2. **Enable caching** for static assets
3. **Monitor memory** usage
4. **Set up alerts** for downtime
5. **Regular backups** of user data
6. **Rate limit** aggressive users
7. **Clean temp files** periodically

---

## 🔒 Security Best Practices

1. **Never commit** `.env` file
2. **Use strong** admin password
3. **Rotate API keys** regularly
4. **Enable HTTPS** (required for webhooks)
5. **Monitor** suspicious activity
6. **Update dependencies** regularly
7. **Limit admin** access

---

## 📞 Support

- Issues: [GitHub Issues](https://github.com/emojysolutions/Queen-Angela-MD/issues)
- Discussions: [GitHub Discussions](https://github.com/emojysolutions/Queen-Angela-MD/discussions)

---

<div align="center">

**Happy Deploying! 👑**

Made with 💜 by emojysolutions

</div>
