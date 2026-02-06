#!/bin/bash
set -e

# Deployment script for Pasabayan AI Chat
# Called by GitHub Actions on push to main

echo "=== Starting deployment ==="
echo "Time: $(date)"

cd /var/www/pasabayan-ai-chat

# Pull latest code
echo "=== Pulling latest code ==="
git pull origin main

# Install dependencies
echo "=== Installing dependencies ==="
npm run install:all

# Build all services
echo "=== Building mcp-server ==="
cd mcp-server && npm run build && cd ..

echo "=== Building chat-backend ==="
cd chat-backend && npm run build && cd ..

echo "=== Building chat-frontend ==="
cd chat-frontend && npm run build && cd ..

# Restart PM2 services
echo "=== Restarting PM2 services ==="
pm2 restart ecosystem.config.js

# Show status
echo "=== PM2 Status ==="
pm2 status

echo "=== Deployment complete ==="
echo "Time: $(date)"
