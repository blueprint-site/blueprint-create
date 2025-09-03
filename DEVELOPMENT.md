# Blueprint Create - Development Guide

## 🚀 Quick Start

### Prerequisites

- Node.js v20+ (use `nvm use` to switch to correct version)
- npm v10+
- Docker & Docker Compose (optional, for containerized development)

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/blueprint-site/blueprint-create.git
cd blueprint-create
```

2. **Setup environment**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

3. **Install dependencies**

```bash
# Using npm workspaces
npm install

# Or using make
make install
```

4. **Start development**

```bash
# Start all services
npm run dev

# Or just frontend
npm run dev:frontend

# Or with make
make dev
```

## 📁 Project Structure

```
blueprint-create/
├── frontend/               # React + Vite frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── backend/               # Backend services
│   └── appwrite/
│       └── functions/     # Appwrite serverless functions
├── docker-compose.dev.yml # Docker development setup
├── turbo.json            # Turborepo configuration
├── package.json          # Root workspace configuration
└── Makefile              # Development shortcuts
```

## 🛠️ Development Commands

### Using npm scripts

```bash
# Development
npm run dev                 # Start all development servers
npm run dev:frontend        # Start frontend only
npm run dev:backend        # Start backend functions
npm run dev:docker         # Start with Docker

# Building
npm run build              # Build for production
npm run build:docker       # Build Docker images

# Testing
npm run test               # Run all tests
npm run test:frontend      # Frontend tests only
npm run test:e2e          # End-to-end tests

# Code Quality
npm run lint               # Run linters
npm run lint:fix          # Fix linting issues
npm run format            # Format code with Prettier
npm run type-check        # TypeScript type checking

# Utilities
npm run analyze           # Analyze bundle size
npm run clean            # Clean build artifacts
npm run reset           # Clean install
npm run update:deps     # Update dependencies
```

### Using Make

```bash
make help              # Show all available commands
make setup            # Initial project setup
make dev              # Start development
make build            # Build for production
make test             # Run tests
make lint             # Run linting
make format           # Format code
make clean            # Clean artifacts
make docker-up        # Start Docker services
make docker-down      # Stop Docker services
```

## 🐳 Docker Development

### Quick Start with Docker

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Or using make
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

### Services Available in Docker

- **Frontend**: http://localhost:5173
- **Meilisearch**: http://localhost:7700
- **Appwrite**: http://localhost:80
- **MailDev**: http://localhost:1080
- **MariaDB**: localhost:3306
- **Redis**: localhost:6379

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for full list):

- `VITE_APPWRITE_URL`: Appwrite API endpoint
- `VITE_APPWRITE_PROJECT_ID`: Appwrite project ID
- `VITE_MEILISEARCH_URL`: Meilisearch API endpoint
- `VITE_MEILISEARCH_API_KEY`: Meilisearch API key

### VS Code Setup

1. Open the workspace file:

```bash
code blueprint.code-workspace
```

2. Install recommended extensions when prompted

3. Restart VS Code to apply workspace settings

## 📦 Technology Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library

### Backend

- **Appwrite** - Backend as a Service
- **Meilisearch** - Search engine
- **Node.js** - Serverless functions

### Development Tools

- **Turborepo** - Monorepo build optimization
- **Concurrently** - Run multiple scripts
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Storybook** - Component development

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm run test

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run e2e tests
npm run test:e2e
```

### Component Development

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build:storybook
```

## 📝 Commit Guidelines

We use conventional commits. Use the interactive commit tool:

```bash
npm run commit
```

Commit types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

## 🚢 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build with Docker
npm run docker:build
```

### Appwrite Functions Deployment

```bash
# Deploy all functions
npm run appwrite:deploy

# Deploy specific function
cd backend/appwrite/functions/[function-name]
npm run deploy
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**

```bash
# Find and kill process using port
lsof -i :5173
kill -9 <PID>
```

2. **Clean install**

```bash
npm run reset
```

3. **Docker issues**

```bash
make clean-docker
make docker-up
```

## 📚 Additional Resources

- [Frontend Architecture](CLAUDE.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.
