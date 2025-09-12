# Deployment Guide untuk GenCV Backend

## 🚀 Deployment ke Vercel (Recommended)

### Langkah 1: Persiapan Repository

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GenCV backend setup"
   git branch -M main
   git remote add origin https://github.com/yourusername/gencv-backend.git
   git push -u origin main
   ```

### Langkah 2: Setup Vercel Project

1. **Login ke Vercel Dashboard**
   - Pergi ke https://vercel.com
   - Login dengan GitHub account

2. **Import Project**
   - Click "New Project"
   - Import dari GitHub repository
   - Select `gencv-backend` repository

3. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --filter=@gencv/web`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `cd ../.. && npm install`

### Langkah 3: Environment Variables

Set environment variables di Vercel dashboard:

```env
# Production Environment Variables
GEMINI_API_KEY=your_production_gemini_api_key
API_SECRET_KEY=your_random_production_secret_key
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### Langkah 4: Vercel Configuration

Buat file `apps/web/vercel.json`:

```json
{
  "functions": {
    "app/api/generate-pdf/route.ts": {
      "maxDuration": 60
    },
    "app/api/ai/route.ts": {
      "maxDuration": 30
    }
  },
  "buildCommand": "cd ../.. && npm run build --filter=@gencv/web",
  "outputDirectory": ".next"
}
```

## 🐳 Docker Deployment (Alternative)

### Dockerfile

Buat `Dockerfile` di root project:

```dockerfile
FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build --filter=@gencv/web

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install Chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Copy the built application
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["npm", "run", "start", "--workspace=@gencv/web"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  gencv-backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - API_SECRET_KEY=${API_SECRET_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

## ☁️ Railway Deployment

1. **Connect Repository**
   - Login ke Railway.app
   - Create new project dari GitHub

2. **Environment Variables**
   ```env
   GEMINI_API_KEY=your_api_key
   API_SECRET_KEY=your_secret
   NODE_ENV=production
   PORT=3000
   ```

3. **Build Configuration**
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm install && npm run build --filter=@gencv/web",
       "startCommand": "npm run start --workspace=@gencv/web"
     }
   }
   ```

## 🔧 Environment Variables Explanation

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key untuk content enhancement |
| `API_SECRET_KEY` | ⚠️ | Secret key untuk API protection (production only) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL aplikasi untuk CORS dan redirects |
| `NODE_ENV` | ✅ | Environment: development, production |

## 🐛 Troubleshooting Deployment

### Vercel Issues

1. **Build Timeout**
   - Increase function timeout di vercel.json
   - Optimize dependencies

2. **Memory Limit**
   - Upgrade Vercel plan untuk memory limit lebih besar
   - Optimize Puppeteer usage

3. **Cold Start**
   - Puppeteer initialization bisa lambat di cold start
   - Consider warming functions

### Docker Issues

1. **Puppeteer/Chrome Issues**
   ```dockerfile
   # Add Chrome dependencies
   RUN apk add --no-cache \
     chromium \
     nss \
     freetype \
     harfbuzz \
     ca-certificates \
     ttf-freefont
   ```

2. **Permission Issues**
   ```dockerfile
   # Use proper user
   USER nextjs
   ```

### Performance Optimization

1. **PDF Generation**
   - Use headless Chrome
   - Optimize HTML/CSS
   - Implement caching

2. **AI Requests**
   - Implement retry logic
   - Add request queuing
   - Cache common responses

## 📊 Monitoring & Logging

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Error monitoring setup
- [ ] Database backup (if applicable)
- [ ] CDN configured for assets
- [ ] Health check endpoint
- [ ] API documentation updated
- [ ] Performance testing completed
- [ ] Security review passed

---

**Ready for production deployment! 🚀**
