# Quick Deployment Checklist

## Before You Start

- [ ] Create GitHub account (if you don't have one)
- [ ] Create Vercel account at https://vercel.com
- [ ] Create Railway account at https://railway.app

## Quick Deploy Steps

### 1. Push to GitHub (5 minutes)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Buyables OSRS tracker"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/buyables-osrs.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select `buyables-osrs` repo
3. Set **Root Directory**: `backend`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   CACHE_TTL_SECONDS=300
   FRONTEND_URL=https://your-app.vercel.app
   USER_AGENT=Buyables/1.0 (your-email@example.com)
   ```
5. Deploy and copy the Railway URL

### 3. Deploy Frontend to Vercel (5 minutes)

**Quick Method - Vercel CLI:**
```bash
cd frontend
npm install -g vercel
vercel

# Add environment variable
vercel env add VITE_API_BASE_URL
# Value: https://your-railway-url.up.railway.app/api
# Environment: Production

# Deploy to production
vercel --prod
```

**Alternative - Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Root Directory: `frontend`
4. Add env var: `VITE_API_BASE_URL` = `https://your-railway-url.up.railway.app/api`
5. Deploy

### 4. Update Backend CORS (1 minute)

1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. It will auto-redeploy

### 5. Test (2 minutes)

Visit your Vercel URL and check:
- [ ] Skills load (Herblore, Prayer, Cooking)
- [ ] Prices show up
- [ ] Sprites display
- [ ] Sorting works
- [ ] Theme toggle works

## Total Time: ~15-20 minutes

## Your Deployment URLs

After deployment, write them down here:

- **Frontend URL**: https://_____________________.vercel.app
- **Backend URL**: https://_____________________.up.railway.app
- **GitHub Repo**: https://github.com/_____________________/buyables-osrs

## Next Steps

- Share your app with OSRS community!
- Consider posting to r/2007scape
- Add a custom domain (optional)
- Monitor Railway usage to stay within free tier

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.
