# Buyables Deployment Guide

This guide will help you deploy the Buyables app to Vercel (frontend) and Railway (backend).

## Prerequisites

- Git installed
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Railway account (sign up at https://railway.app) - for backend

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
cd c:\Users\dm_bu\codebase\buyables
git init
git add .
git commit -m "Initial commit - Buyables OSRS tracker"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `buyables-osrs`
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/buyables-osrs.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `buyables-osrs` repository
4. Railway will detect your project, click "Add variables"
5. Set the **Root Directory** to `backend`
6. Add these environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `CACHE_TTL_SECONDS` = `300`
   - `FRONTEND_URL` = `https://your-app-name.vercel.app` (you'll update this later)
   - `USER_AGENT` = `Buyables/1.0 (your-email@example.com)`

7. Click "Deploy"
8. Once deployed, copy your Railway backend URL (e.g., `buyables-backend.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **buyables-osrs**
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. Add environment variable:
```bash
vercel env add VITE_API_BASE_URL
```
   - What's the value? `https://your-railway-url.up.railway.app/api`
   - Which environments? Select **Production** (press Space, then Enter)

6. Deploy to production:
```bash
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `buyables-osrs` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-railway-url.up.railway.app/api`

6. Click "Deploy"

## Step 4: Update Backend CORS

After both are deployed:

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable to your Vercel URL:
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app`
3. Railway will automatically redeploy

## Step 5: Test Your Deployment

Visit your Vercel URL and test:
- Can you see the Herblore, Prayer, and Cooking skills?
- Do the prices load?
- Do the sprites show up?
- Does sorting work?
- Does theme toggle work?

## Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_API_BASE_URL` in Vercel matches your Railway URL
- Check that `FRONTEND_URL` in Railway matches your Vercel URL
- Check browser console for CORS errors

### Backend crashes on Railway
- Check Railway logs
- Ensure `package.json` has `"start": "node src/server.js"`
- Ensure `NODE_ENV=production`

### Prices not loading
- Check Railway logs for API errors
- Ensure USER_AGENT is set in Railway environment variables
- OSRS Wiki API might be rate limiting - wait 5 minutes

## Custom Domain (Optional)

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Update Backend
Update `FRONTEND_URL` in Railway to include your custom domain

## Future Updates

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update message"
git push
```
Vercel will auto-deploy on push to main branch.

### Update Backend
```bash
cd backend
git add .
git commit -m "Update message"
git push
```
Railway will auto-deploy on push to main branch.

## Cost Estimate

- **Vercel Frontend**: Free (Hobby plan)
- **Railway Backend**: $5/month free credit, then ~$5-10/month
- **Total**: Free for hobby use, ~$5-10/month if you exceed free tier

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Check Railway deployment logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
