# Al-Zain Furniture - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Git installed (for Vercel deployment)

## Step-by-Step Deployment

### 1. Install Node.js (if not installed)
Download from: https://nodejs.org/
Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies
Navigate to project folder and run:
```bash
npm install
```

### 3. Development Server
Test locally:
```bash
npm run dev
```
Visit: http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Push code to GitHub
2. Visit vercel.com
3. Click "New Project"
4. Import your GitHub repo
5. Click "Deploy"

### 6. Environment Variables (Optional)
In Vercel dashboard, add:
- NEXT_PUBLIC_SITE_URL
- Any API keys if needed

## Post-Deployment
- Custom domain: Add in Vercel settings
- SSL: Auto-enabled by Vercel
- Analytics: Enable Vercel Analytics

## Support
For issues, contact: info@alzain.jo
