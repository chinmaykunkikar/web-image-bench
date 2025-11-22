# Deployment Guide

## 🚀 GitHub Pages Deployment

This project is configured to deploy to GitHub Pages using the repository name `web-image-bench`.

### Prerequisites

- GitHub repository created with name: `web-image-bench`
- Local repository connected to GitHub remote

### One-Time Setup

1. **Create the GitHub repository** (if not already done):

   ```bash
   # Go to GitHub and create a new repository named: web-image-bench
   ```

2. **Connect your local repository to GitHub**:
   ```bash
   git remote add origin https://github.com/chinmaykunkikar/web-image-bench.git
   git branch -M master
   git push -u origin master
   ```

### Deploy to GitHub Pages

Simply run:

```bash
npm run deploy
```

This will:

1. Build the production bundle using Vite
2. Create/update the `gh-pages` branch
3. Push the `dist` folder contents to that branch
4. Your site will be live at: `https://chinmaykunkikar.github.io/web-image-bench/`

### Enable GitHub Pages (First time only)

After your first deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait a few minutes for the site to go live

### Configuration Files

- **`vite.config.js`**: Contains the `base: '/web-image-bench/'` setting for correct asset paths
- **`package.json`**: Contains the `deploy` script
- **`public/.nojekyll`**: Prevents GitHub Pages from ignoring Vite's build files
- **`public/favicon.ico`**: Favicon moved to public folder for proper serving

### Local Development

To test the production build locally:

```bash
npm run build
npm run preview
```

### Updating the Site

Whenever you make changes:

1. Commit your changes to the `master` branch
2. Run `npm run deploy`
3. Changes will be live in a few minutes

### Notes

- The `gh-pages` branch is auto-generated and should not be edited manually
- GitHub Pages deployment happens from the `gh-pages` branch, not `master`
- The live site URL will be: `https://chinmaykunkikar.github.io/web-image-bench/`
