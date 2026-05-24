# GitHub Repository Viewer

A GitHub-style repository viewer that lists public repositories of a user with key metrics: name, description, commit count, forks, and stars.

## Features

- Search for any GitHub user's public repositories
- View repository cards with:
  - Repository name and description
  - Top 3 programming languages
  - Commit count, forks, and stars
  - Last commit date
- Dark/light theme toggle
- Responsive design with Tailwind CSS + DaisyUI
- Data caching with SWR

## Tech Stack

- React 19 (TypeScript)
- Vite
- Tailwind CSS + DaisyUI
- SWR
- GitHub REST API v3

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Test

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run cypress:open
```

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions. See `.github/workflows/deploy.yml`.

## License

MIT
