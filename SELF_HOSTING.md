# Rybbit - Self-Hosted with Full Feature Access

This fork enables self-hosted instances to access all cloud-only features (Web Vitals, Error Tracking, Email Reports, OAuth, etc.) through a modular feature flag system—without the limitations imposed by the `IS_CLOUD` toggle.

## Why This Fork?

The upstream project gates advanced features behind `IS_CLOUD=true`, which also enables unwanted restrictions like Stripe billing, 3,000 event/month limits, and cloud-specific monitoring. This fork decouples those features so self-hosters get full functionality without cloud-specific overhead.

## Quick Start

**Time estimate:** 15-20 minutes (first build takes longest)

### 1. Clone Repository

```bash
git clone https://github.com/antebudimir/rybbit.git
# OR
git clone git@github.com:antebudimir/rybbit.git
cd rybbit
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install --legacy-peer-deps
cd ..
```

### 3. Build Packages

```bash
# Build shared packages first (required)
npm run build:shared

# Build server
cd server && npm run build

# Build client
cd ../client && npm run build
cd ..
```

### 4. Environment Setup

Copy `.env.example` to `.env` and configure:

**Essential:**

```bash
BASE_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-here  # Generate: openssl rand -base64 32
```

**Feature Flags (enabled by default):**

```bash
# Analytics features work out of the box
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# OAuth UI buttons (functionality requires API keys below)
NEXT_PUBLIC_ENABLE_GSC=true
NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true
NEXT_PUBLIC_ENABLE_GITHUB_OAUTH=true
```

**Optional API Keys (for enhanced functionality):**

```bash
# Email weekly reports (requires Resend.com account)
RESEND_API_KEY=your_key

# VPN/Crawler detection + enhanced geolocation
IPAPI_KEY=your_key

# OAuth login functionality
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

### 5. Database Setup

```bash
# Start PostgreSQL + ClickHouse
docker compose up -d postgres clickhouse

# Wait for databases (choose one)
# Option A: Automatic wait (Docker Compose v2.17+)
docker compose wait postgres clickhouse

# Option B: Manual wait
sleep 15

# Option C: Check status
docker compose ps  # Both should show "healthy"
```

### 6. Run Services

```bash
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend (new terminal)
cd client && npm start
```

### 7. Access Application

- **Frontend:** <http://localhost:3002>
- **Backend API:** <http://localhost:3001>
- **First signup becomes admin automatically**

## Features Now Available to Self-Hosters

✅ **Web Vitals** - Core Web Vitals monitoring (LCP, FID, CLS)  
✅ **Error Tracking** - JavaScript error capture  
✅ **Network Analytics** - ASN, ISP, datacenter detection  
✅ **VPN/Proxy Detection** - Bot and crawler filtering  
✅ **OAuth Integration** - Google & GitHub login  
✅ **Google Search Console** - SEO metrics integration  
✅ **Email Reports** - Weekly analytics summaries  
✅ **Unlimited Events** - No artificial limits

## Docker Alternative (Production)

For production with Docker only:

```bash
# Build and run everything
docker compose up -d --build

# First build takes 5-10 minutes
# Access at http://localhost:3002
```

For reverse proxy configurations (Nginx, Caddy, Traefik), see [official guide](https://rybbit.com/docs/self-hosting-guides/self-hosting-manual).

## Troubleshooting

**Build fails:**  

- Ensure `npm run build:shared` ran successfully first
- Delete `node_modules` in all directories and reinstall

**Database connection errors:**  

- Wait 15-20 seconds after `docker compose up` before starting services
- Check health: `docker compose ps postgres clickhouse`

**Port conflicts:**  
Modify in `.env`:

```bash
BACKEND_PORT=3001
FRONTEND_PORT=3002
```

**Dependencies issues:**  

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

- Change `BASE_URL` to your domain (e.g., `https://analytics.yourdomain.com`)
- Generate strong `BETTER_AUTH_SECRET` (32+ characters)
- Set up SSL with Caddy/Nginx/Traefik
- Configure firewall (ports 80, 443)
- Enable database backups (PostgreSQL, ClickHouse volumes)
- Review [advanced guide](https://rybbit.com/docs/self-hosting-guides/advanced)
