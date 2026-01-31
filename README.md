# Fuhriman Portfolio Website

A personal portfolio website built with Next.js, showcasing DevOps engineering skills and experience.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Deployment**: Docker + Kubernetes (EKS) + ArgoCD

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Docker Build

```bash
# Build the image
docker build -t furryman/fuhriman-website:latest .

# Run the container
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/build-deploy.yaml`) automatically:

1. Builds a Docker image on push to `main`
2. Pushes to Docker Hub with timestamp tag (`ga-YYYY.MM.DD-HHMM`)
3. Updates the Helm chart in `eks-helm-charts` repository
4. ArgoCD automatically syncs the new image to the cluster

### Required Secrets

Configure these secrets in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `GH_PAT` | GitHub Personal Access Token with repo scope |

## Project Structure

```
fuhriman-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── Hero.tsx         # Hero section
│       ├── About.tsx        # About section
│       ├── Skills.tsx       # Skills showcase
│       ├── Experience.tsx   # Work experience
│       └── Contact.tsx      # Contact info
├── public/                  # Static assets
├── Dockerfile               # Multi-stage Docker build
├── package.json
├── next.config.js
└── tsconfig.json
```

## License

MIT
