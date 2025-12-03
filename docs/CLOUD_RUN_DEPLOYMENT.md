# Deploy to Google Cloud Run

## Prerequisites

1. Google Cloud account with billing enabled
2. Google Cloud CLI installed (`gcloud`)
3. Docker installed (for local testing)

## Quick Deploy

### Option 1: Using Cloud Build (Recommended)

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

### Option 2: Manual Deploy

```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/pumpkin-harvest .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/pumpkin-harvest

# Deploy to Cloud Run
gcloud run deploy pumpkin-harvest \
  --image gcr.io/YOUR_PROJECT_ID/pumpkin-harvest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

## Local Testing with Docker

```bash
# Build
docker build -t pumpkin-harvest .

# Run
docker run -p 8080:8080 pumpkin-harvest

# Open http://localhost:8080
```

## Environment Variables

Set these in Cloud Run if needed:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| NODE_ENV | Environment | production |

## Database (Production)

For production, replace in-memory storage with:

### Option 1: Cloud Firestore
```javascript
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();
```

### Option 2: Cloud SQL (PostgreSQL)
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### Option 3: MongoDB Atlas
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
```

## WebSocket on Cloud Run

Cloud Run supports WebSocket connections. The current setup works, but note:
- Connections may timeout after 15 minutes of inactivity
- Use Cloud Pub/Sub for more reliable real-time messaging at scale

## Costs

Cloud Run pricing (as of 2024):
- First 2 million requests/month: FREE
- CPU: $0.00002400 per vCPU-second
- Memory: $0.00000250 per GiB-second
- Min instances = 0 means you only pay when used

## CI/CD with GitHub

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: pumpkin-harvest
          region: europe-west1
          source: .
```

## Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service pumpkin-harvest \
  --domain your-domain.com \
  --region europe-west1
```

## Monitoring

View logs:
```bash
gcloud run services logs read pumpkin-harvest --region europe-west1
```

Or use Cloud Console: https://console.cloud.google.com/run
