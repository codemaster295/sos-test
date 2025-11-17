#!/bin/bash

# SOS Production Start Script using PM2
# This script builds and starts both frontend and backend in production mode

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install it first:"
    echo "  npm install -g pm2"
    exit 1
fi

print_info "PM2 is installed ✓"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_info "Starting production deployment..."
print_info "Working directory: $SCRIPT_DIR"

# Step 1: Build Backend
print_info "Building backend..."
cd backend

if [ ! -d "node_modules" ]; then
    print_warn "node_modules not found. Installing dependencies..."
    npm install
fi

print_info "Compiling TypeScript..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Backend build failed. dist/ directory not found."
    exit 1
fi

print_info "Backend build completed ✓"
cd ..

# Step 2: Build Frontend
print_info "Building frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    print_warn "node_modules not found. Installing dependencies..."
    npm install
fi

print_info "Building React application..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Frontend build failed. dist/ directory not found."
    exit 1
fi

print_info "Frontend build completed ✓"
cd ..

# Step 3: Stop existing PM2 processes (if any)
print_info "Stopping existing SOS processes..."
pm2 stop sos-backend sos-frontend 2>/dev/null || true
pm2 delete sos-backend sos-frontend 2>/dev/null || true

# Step 4: Start Backend with PM2
print_info "Starting backend with PM2..."
cd backend

# Create logs directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/logs"

pm2 start dist/index.js \
    --name sos-backend \
    --cwd "$SCRIPT_DIR/backend" \
    --instances 1 \
    --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
    --merge-logs \
    --error "$SCRIPT_DIR/logs/backend-error.log" \
    --output "$SCRIPT_DIR/logs/backend-out.log" \
    --env production

cd ..

# Step 5: Start Frontend with PM2
print_info "Starting frontend with PM2..."
cd frontend

# Create logs directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/logs"

# Start frontend with PM2 using npm run serve (which uses npx serve)
pm2 start npm \
    --name sos-frontend \
    --cwd "$SCRIPT_DIR/frontend" \
    --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
    --merge-logs \
    --error "$SCRIPT_DIR/logs/frontend-error.log" \
    --output "$SCRIPT_DIR/logs/frontend-out.log" \
    -- run serve

cd ..

# Step 6: Save PM2 configuration
print_info "Saving PM2 configuration..."
pm2 save

# Step 7: Display status
print_info "Waiting for processes to start..."
sleep 2

echo ""
print_info "=== PM2 Process Status ==="
pm2 list

echo ""
print_info "=== Application URLs ==="
echo "  Backend API:  http://localhost:3001"
echo "  Frontend App: http://localhost:3000"
echo "  Health Check: http://localhost:3001/health"

echo ""
print_info "=== Useful PM2 Commands ==="
echo "  pm2 logs              - View all logs"
echo "  pm2 logs sos-backend  - View backend logs"
echo "  pm2 logs sos-frontend - View frontend logs"
echo "  pm2 monit             - Monitor processes"
echo "  pm2 stop all          - Stop all processes"
echo "  pm2 restart all        - Restart all processes"
echo "  pm2 delete all        - Delete all processes"

echo ""
print_info "Production deployment completed successfully! ✓"
print_info "Both applications are now running with PM2."

