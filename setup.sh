#!/bin/bash

# E-Court System - Quick Setup Script
# For Linux and macOS

set -e

echo "🚀 E-Court System - Setup & Launch"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Check MongoDB
echo -e "${YELLOW}Checking MongoDB...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB not found locally. You'll need to:${NC}"
    echo "  1. Install MongoDB: https://www.mongodb.com/try/download/community"
    echo "  2. Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Backend Setup
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
fi
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

# Frontend Setup
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
    echo -e "${GREEN}✓ Created .env.local file${NC}"
fi
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "To start the system, run:"
echo ""
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "  cd backend && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
