.PHONY: help install dev build test clean docker-up docker-down reset

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo '${GREEN}Blueprint Create Development Commands${NC}'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "${YELLOW}%-20s${NC} %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo '${GREEN}Installing dependencies...${NC}'
	npm install
	npm install --workspaces

dev: ## Start development servers
	@echo '${GREEN}Starting development servers...${NC}'
	npm run dev

dev-frontend: ## Start frontend development server only
	@echo '${GREEN}Starting frontend development server...${NC}'
	npm run dev:frontend

dev-backend: ## Start backend functions development
	@echo '${GREEN}Starting backend functions...${NC}'
	npm run dev:backend

dev-docker: ## Start development with Docker
	@echo '${GREEN}Starting Docker development environment...${NC}'
	docker-compose -f docker-compose.dev.yml up

build: ## Build for production
	@echo '${GREEN}Building for production...${NC}'
	npm run build

build-docker: ## Build Docker images
	@echo '${GREEN}Building Docker images...${NC}'
	npm run docker:build

test: ## Run all tests
	@echo '${GREEN}Running tests...${NC}'
	npm run test

test-frontend: ## Run frontend tests
	@echo '${GREEN}Running frontend tests...${NC}'
	npm run test:frontend

lint: ## Run linting
	@echo '${GREEN}Running linters...${NC}'
	npm run lint

lint-fix: ## Fix linting issues
	@echo '${GREEN}Fixing linting issues...${NC}'
	npm run lint:fix

format: ## Format code
	@echo '${GREEN}Formatting code...${NC}'
	npm run format

type-check: ## Run type checking
	@echo '${GREEN}Running type check...${NC}'
	npm run type-check

analyze: ## Analyze bundle size
	@echo '${GREEN}Analyzing bundle size...${NC}'
	npm run analyze

clean: ## Clean all build artifacts and dependencies
	@echo '${RED}Cleaning build artifacts and dependencies...${NC}'
	npm run clean

clean-docker: ## Clean Docker volumes and containers
	@echo '${RED}Cleaning Docker environment...${NC}'
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

reset: ## Reset everything (clean install)
	@echo '${RED}Resetting project...${NC}'
	npm run reset

docker-up: ## Start Docker services
	@echo '${GREEN}Starting Docker services...${NC}'
	docker-compose -f docker-compose.dev.yml up -d

docker-down: ## Stop Docker services
	@echo '${YELLOW}Stopping Docker services...${NC}'
	docker-compose -f docker-compose.dev.yml down

docker-logs: ## Show Docker logs
	docker-compose -f docker-compose.dev.yml logs -f

setup: ## Initial project setup
	@echo '${GREEN}Setting up project...${NC}'
	@if [ ! -f .env ]; then cp .env.example .env; echo '${YELLOW}Created .env file from .env.example${NC}'; fi
	@make install
	@echo '${GREEN}Setup complete!${NC}'

update-deps: ## Update all dependencies
	@echo '${GREEN}Updating dependencies...${NC}'
	npm run update:deps

security-check: ## Run security audit
	@echo '${GREEN}Running security audit...${NC}'
	npm run security:audit

commit: ## Create a conventional commit
	@echo '${GREEN}Creating conventional commit...${NC}'
	npm run commit