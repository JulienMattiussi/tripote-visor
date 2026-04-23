.PHONY: help install dev build preview test test-watch format format-check check clean

default: help

help: ## Display available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk -F ':.*?## ' '{printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

# Installation & dev

install: ## Install all dependencies
	npm install

dev: ## Start vite dev server (http://localhost:5173)
	npm run dev

build: ## Build static site to dist/
	npm run build

preview: ## Preview the production build
	npm run preview

# Code quality

format: ## Format code with prettier
	npm run format

format-check: ## Check formatting (CI)
	npm run format:check

check: format-check test ## Run all checks (format + tests)

# Tests

test: ## Run all tests once
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

# Maintenance

clean: ## Remove build artefacts
	rm -rf dist .vite
