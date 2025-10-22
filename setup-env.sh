#!/usr/bin/env bash
set -e

echo "🔧 Environment Setup Script for Payload Ecommerce"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} Found: $1"
    return 0
  else
    echo -e "${RED}✗${NC} Missing: $1"
    return 1
  fi
}

# Function to validate env variable
check_env_var() {
  local file=$1
  local var=$2
  local value=$(grep "^${var}=" "$file" 2>/dev/null | cut -d'=' -f2-)
  
  if [ -z "$value" ] || [ "$value" = "changeme" ] || [ "$value" = "sk_test_xxx" ] || [ "$value" = "whsec_xxx" ]; then
    echo -e "${YELLOW}⚠${NC}  $var needs to be configured in $file"
    return 1
  else
    echo -e "${GREEN}✓${NC} $var is set"
    return 0
  fi
}

echo "📁 Checking Backend Environment..."
echo "-----------------------------------"

if check_file "backend/.env"; then
  cd backend
  check_env_var ".env" "PAYLOAD_SECRET"
  check_env_var ".env" "DATABASE_URL"
  check_env_var ".env" "SERVER_URL"
  check_env_var ".env" "CORS_ORIGIN"
  check_env_var ".env" "STRIPE_SECRET_KEY"
  check_env_var ".env" "STRIPE_WEBHOOK_SECRET"
  cd ..
else
  echo -e "${YELLOW}Creating backend/.env from example...${NC}"
  cp backend/.env.example backend/.env
  echo -e "${YELLOW}⚠${NC}  Please update backend/.env with your actual values"
fi

echo ""
echo "📁 Checking Frontend Environment..."
echo "-----------------------------------"

if check_file "frontend/.env"; then
  cd frontend
  check_env_var ".env" "NEXT_PUBLIC_API_URL"
  check_env_var ".env" "NEXT_PUBLIC_SITE_URL"
  cd ..
else
  echo -e "${YELLOW}Creating frontend/.env from example...${NC}"
  cp frontend/.env.example frontend/.env
fi

echo ""
echo "🔍 Checking PostgreSQL Connection..."
echo "-----------------------------------"

# Extract DATABASE_URL from backend/.env
if [ -f "backend/.env" ]; then
  DB_URL=$(grep "^DATABASE_URL=" backend/.env | cut -d'=' -f2-)
  
  if [ -n "$DB_URL" ]; then
    # Try to extract database name
    DB_NAME=$(echo "$DB_URL" | grep -oP '(?<=/)[^/]+$' || echo "")
    
    if command -v psql &> /dev/null; then
      echo "Testing database connection..."
      if psql "$DB_URL" -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Database connection successful"
      else
        echo -e "${RED}✗${NC} Cannot connect to database"
        echo -e "${YELLOW}⚠${NC}  Make sure PostgreSQL is running and database exists"
        echo -e "${YELLOW}⚠${NC}  You can create it with: createdb $DB_NAME"
      fi
    else
      echo -e "${YELLOW}⚠${NC}  psql not found, skipping database check"
    fi
  fi
fi

echo ""
echo "📋 Summary"
echo "-----------------------------------"
echo ""
echo "Backend runs on:  http://localhost:4000"
echo "Frontend runs on: http://localhost:3000"
echo ""
echo "To start:"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: cd frontend && npm run dev"
echo ""
echo -e "${GREEN}Setup check complete!${NC}"
