#!/bin/bash

# Pasabayan AI Chat - Health Check Script
# Checks if all services are running and healthy

echo "🏥 Pasabayan AI Chat Health Check"
echo "=================================="
echo ""

check_service() {
    local name=$1
    local url=$2

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" == "200" ]; then
        echo "✅ $name: Healthy"
        return 0
    else
        echo "❌ $name: Not responding (HTTP $response)"
        return 1
    fi
}

# Check each service
check_service "MCP Server" "http://localhost:3002/health"
mcp_status=$?

check_service "Chat Backend" "http://localhost:3001/health"
backend_status=$?

check_service "Chat Frontend" "http://localhost:3003"
frontend_status=$?

echo ""

# Summary
if [ $mcp_status -eq 0 ] && [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo "🎉 All services are healthy!"
    echo ""
    echo "🌐 Open http://localhost:3003 to use the chat"
    exit 0
else
    echo "⚠️  Some services are not running"
    echo ""
    echo "To start all services, run:"
    echo "  ./scripts/dev-start.sh"
    exit 1
fi
