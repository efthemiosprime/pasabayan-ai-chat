#!/bin/bash

# Pasabayan AI Chat - Development Start Script
# Starts all three services in separate terminal tabs (macOS)

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🚀 Starting Pasabayan AI Chat Development Environment"
echo "   Project: $PROJECT_DIR"
echo ""

# Check if .env exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Run: cp .env.example .env"
    echo "   Then fill in your values"
    exit 1
fi

# Check node_modules
check_deps() {
    if [ ! -d "$PROJECT_DIR/$1/node_modules" ]; then
        echo "📦 Installing dependencies for $1..."
        cd "$PROJECT_DIR/$1" && npm install
    fi
}

check_deps "mcp-server"
check_deps "chat-backend"
check_deps "chat-frontend"

echo ""
echo "Starting services..."
echo ""

# macOS: Open new terminal tabs
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript <<EOF
tell application "Terminal"
    activate

    -- MCP Server (Tab 1)
    do script "cd '$PROJECT_DIR/mcp-server' && echo '🔧 MCP Server' && npm run dev"

    -- Chat Backend (Tab 2)
    delay 1
    tell application "System Events" to keystroke "t" using command down
    delay 0.5
    do script "cd '$PROJECT_DIR/chat-backend' && echo '🤖 Chat Backend' && npm run dev" in front window

    -- Chat Frontend (Tab 3)
    delay 1
    tell application "System Events" to keystroke "t" using command down
    delay 0.5
    do script "cd '$PROJECT_DIR/chat-frontend' && echo '🖥️  Chat Frontend' && npm run dev" in front window
end tell
EOF

    echo "✅ Services starting in Terminal tabs!"
    echo ""
    echo "   MCP Server:    http://localhost:3002"
    echo "   Chat Backend:  http://localhost:3001"
    echo "   Chat Frontend: http://localhost:3003"
    echo ""
    echo "🌐 Open http://localhost:3003 in your browser"

else
    # Linux/other: Use background processes
    echo "Starting MCP Server..."
    cd "$PROJECT_DIR/mcp-server" && npm run dev &

    echo "Starting Chat Backend..."
    cd "$PROJECT_DIR/chat-backend" && npm run dev &

    echo "Starting Chat Frontend..."
    cd "$PROJECT_DIR/chat-frontend" && npm run dev &

    echo ""
    echo "✅ Services started in background!"
    echo "   Use 'pkill -f tsx' to stop all services"
fi
