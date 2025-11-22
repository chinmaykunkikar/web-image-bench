# Web Image Bench

A React app that demonstrates the performance and caching differences between Base64-encoded images and external image files.

🔗 **[Live Demo](https://chinmaykunkikar.github.io/web-image-bench/)**

## Quick Start

```bash
npm install
npm run dev
```

## What We're Testing

This tool compares two ways of including images in web pages:

- **Base64 Inline:** Your image is converted to a text string and embedded directly in your HTML/CSS/JS code
- **External File:** Your image remains a separate file that the browser downloads when needed

## How Caching Works

When you revisit a website, browsers cache (store) external files to avoid re-downloading them. Here's what happens:

- **Cold Load (First Visit):** Browser downloads everything for the first time. Both Base64 and external images need to be loaded.
- **Warm Load (Return Visit):** Browser uses cached files. External images load from cache (0 bytes transferred), but Base64 images must be re-downloaded because they're part of your code bundle.

## What We're Simulating

This app runs entirely in your browser using IndexedDB (local storage):

- **"Test Without Cache"** clears the cache and measures first-time load performance
- **"Test With Cache"** stores images in IndexedDB and measures repeat-visit performance
- Base64 encoding happens in JavaScript to show the size overhead (+33% due to encoding)

## The Takeaway

Base64 encoding is convenient for tiny icons or critical images, but for most images, external files are better because:

- They cache independently, reducing bandwidth on repeat visits
- They don't bloat your HTML/CSS/JS bundles
- Browsers can lazy-load them as needed

## Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Tech Stack

- React 19 + Vite
- IndexedDB (via idb-keyval)
