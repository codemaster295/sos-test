#!/bin/bash

# SOS Production Restart Script
# This script restarts all SOS processes running in PM2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} PM2 is not installed."
    exit 1
fi

print_info "Restarting SOS production processes..."

# Restart processes
pm2 restart sos-backend sos-frontend 2>/dev/null || {
    print_warn "Processes not running. Starting them..."
    ./start-production.sh
    exit 0
}

print_info "All SOS processes restarted successfully! ✓"

echo ""
print_info "=== PM2 Process Status ==="
pm2 list

