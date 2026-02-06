# Deployment Guide for NeuroRevenue

## Step-by-Step Guide to Deploy on GitHub Pages

### Prerequisites
- GitHub account (you already have this ✓)
- Git installed on your computer

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `neuro-revenue`
4. Choose "Public"
5. **DO NOT** initialize with README (we already have files)
6. Click "Create repository"

### Step 2: Upload Your Code

**Option A: Using Git (Recommended)**

Open your terminal/command prompt in the neuro-revenue folder and run:

```bash
cd /path/to/neuro-revenue
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/drsuyog1979/neuro-revenue.git
git push -u origin main
```

**Option B: Using GitHub Website**

1. On your repository page, click "uploading an existing file"
2. Drag and drop ALL files from the neuro-revenue folder
3. Commit the changes

### Step 3: Enable GitHub Pages with Actions

1. Go to your repository on GitHub
2. Click "Settings" (top menu)
3. Click "Pages" (left sidebar)
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. Wait 2-3 minutes for the first deployment

### Step 4: Access Your App

Your app will be live at:
```
https://drsuyog1979.github.io/neuro-revenue/
```

### Updating Your App

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

The app will automatically rebuild and redeploy!

## Important Configuration Notes

### Base URL Configuration
The `vite.config.ts` is already configured with:
```typescript
base: '/neuro-revenue/'
```

This matches your repository name. **If you change the repository name**, update this value accordingly.

### Troubleshooting

**Problem: Blank page or 404 error**
- Check that GitHub Pages is set to "GitHub Actions" (not "Deploy from a branch")
- Wait 2-3 minutes after first deployment
- Check the "Actions" tab for build errors

**Problem: Styles not loading**
- Clear your browser cache
- Try incognito/private mode

**Problem: Build fails**
- Check the "Actions" tab for error details
- Ensure all files were uploaded correctly

## Local Development

Before deploying, you can test locally:

```bash
# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Build for production (test)
npm run build
```

## Need Help?

If you encounter issues:
1. Check the "Actions" tab on GitHub for build logs
2. Verify all files are in the repository
3. Ensure GitHub Pages is enabled with "GitHub Actions" source

---

**Your app URL:** https://drsuyog1979.github.io/neuro-revenue/

Good luck! 🚀
