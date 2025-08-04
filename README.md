# Planner App

A Sanity Studio app for planning and task management.

## Development

```bash
npm install
npm run dev
```

## Deployment

This app is configured for deployment on Vercel.

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `SANITY_PROJECT_ID`: Your Sanity project ID (e.g., 'o7xwtv7a')
- `SANITY_DATASET`: Your Sanity dataset (e.g., 'production')

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the Sanity framework and deploy

## Build

```bash
npm run build
``` 