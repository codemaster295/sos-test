#!/bin/bash

# SOS Production Stop Script
# This script stops all SOS processes running in PM2

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

print_info "Stopping SOS production processes..."

# Stop processes
pm2 stop sos-backend sos-frontend 2>/dev/null || print_warn "Processes not running"

# Delete processes
pm2 delete sos-backend sos-frontend 2>/dev/null || print_warn "Processes not found"

# Save PM2 configuration
pm2 save

print_info "All SOS processes stopped successfully! ✓"

echo ""
print_info "=== PM2 Process Status ==="
pm2 list

