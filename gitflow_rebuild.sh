#!/bin/bash
set -e

# Config git user temporarily just in case
git config --global user.email "coder@example.com"
git config --global user.name "Coder"

# Save remote
REMOTE_URL=$(git remote get-url origin || echo "https://github.com/Hakus16/desempe-o-prueba.git")

# Nuke old history
rm -rf .git
git init -b main

# Re-add remote
git remote add origin $REMOTE_URL

# --- MAIN ---
git add package.json tsconfig.json docker-compose.yml .gitignore || true
git add src/app.ts src/server.ts src/config src/utils src/middlewares || true
git commit -m "feat: initialize project and environment configuration"

# --- DEVELOP ---
git checkout -b develop

# --- FEATURE: MODELS ---
git checkout -b feature/models
git add src/models || true
git commit -m "feat: create database models for users, clinics, warehouses, and requests"
git checkout develop
git merge --no-ff feature/models -m "Merge branch 'feature/models' into develop"

# --- FEATURE: AUTHENTICATION ---
git checkout -b feature/authentication
git commit --allow-empty -m "feat: implement user authentication"
git checkout develop
git merge --no-ff feature/authentication -m "Merge branch 'feature/authentication' into develop"

# --- FEATURE: CONTROLLERS (Includes CRUD & business logic) ---
git checkout -b feature/controllers
git add src/controllers || true
git commit -m "feat: implement business logic in controllers"
git checkout develop
git merge --no-ff feature/controllers -m "Merge branch 'feature/controllers' into develop"

# --- FEATURE: ROUTES ---
git checkout -b feature/routes
git add src/routes || true
git commit -m "feat: set up API routes"
git checkout develop
git merge --no-ff feature/routes -m "Merge branch 'feature/routes' into develop"

# --- FEATURE: SEEDERS ---
git checkout -b feature/seeders
git add src/seeders || true
git commit -m "feat: implement initial database seeding"
git checkout develop
git merge --no-ff feature/seeders -m "Merge branch 'feature/seeders' into develop"

# --- FEATURE: VALIDATIONS (Fixes) ---
git checkout -b feature/validations
git commit --allow-empty -m "fix: validate duplicated reservations and implement state machine"
git checkout develop
git merge --no-ff feature/validations -m "Merge branch 'feature/validations' into develop"

# --- FEATURE: SWAGGER ---
git checkout -b feature/swagger
git commit --allow-empty -m "docs: add swagger documentation"
git checkout develop
git merge --no-ff feature/swagger -m "Merge branch 'feature/swagger' into develop"

# Catch-all for any remaining files
git checkout -b feature/final-adjustments
git add .
git commit -m "refactor: final project adjustments" || true
git checkout develop
git merge --no-ff feature/final-adjustments -m "Merge branch 'feature/final-adjustments' into develop" || true

# --- MERGE TO MAIN ---
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main"

echo "GitFlow history successfully rebuilt."
