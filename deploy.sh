#!/bin/bash

# Exit on any error
set -e

SERVER="think-server"
REMOTE_DIR="~/to-do-list"

echo "======================================================"
echo "🚀 Deploying 'to-do-list' to $SERVER..."
echo "======================================================"

echo "1. Creating project directory on remote server..."
ssh $SERVER "mkdir -p $REMOTE_DIR"

echo "2. Syncing files (ignoring node_modules, dist, etc)..."
rsync -av --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'frontend/dist' \
    --exclude 'deploy.sh' \
    ./ $SERVER:$REMOTE_DIR/

echo "3. Building and restarting Docker containers..."
ssh $SERVER "cd $REMOTE_DIR && docker compose up --build -d"

echo "======================================================"
echo "✅ Deployment completed successfully!"
echo "======================================================"
