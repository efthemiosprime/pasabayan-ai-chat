# Pasabayan AI Chat

AI-powered chatbot for Pasabayan platform, providing intelligent support for both admin/support teams and end users.

## Features

- **Admin Mode**: Full platform access - look up any user, match, transaction, platform stats
- **User Mode**: Scoped access - query own deliveries, trips, payments via iOS app
- **Real-time Chat**: ChatGPT-like interface with streaming responses
- **Tool Integration**: MCP server exposing Pasabayan API as AI tools
- **iOS SDK**: SwiftUI components for mobile integration

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Production Environment                             │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   Chat UI       │    │  Chat Backend   │    │   MCP Server    │          │
│  │   (Next.js)     │───►│  (Node.js)      │───►│   (Node.js)     │          │
│  │   Port 3000     │    │  Port 3001      │    │  Port 3002      │          │
│  └─────────────────┘    └────────┬────────┘    └────────┬────────┘          │
│                                  │                      │                    │
│                                  ▼                      ▼                    │
│                         ┌─────────────────┐    ┌─────────────────┐          │
│                         │  Claude API     │    │  Pasabayan API  │          │
│                         │  (Anthropic)    │    │  (Laravel)      │          │
│                         └─────────────────┘    └─────────────────┘          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
pasabayan-ai-chat/
├── mcp-server/           # MCP Server - Pasabayan API bridge
│   ├── src/
│   │   ├── tools/        # AI tools (trips, packages, matches, etc.)
│   │   └── utils/        # API client, formatters
│   └── Dockerfile
├── chat-backend/         # Chat Backend - Claude API orchestrator
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Claude integration
│   │   └── middleware/   # Auth, rate limiting
│   └── Dockerfile
├── chat-frontend/        # Web UI - ChatGPT-like interface
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   └── lib/          # API client, types
│   └── Dockerfile
├── ios-sdk/              # iOS SDK - SwiftUI components
│   ├── PasabayanChat/
│   │   ├── ChatService.swift
│   │   └── ChatView.swift
│   └── README.md
├── docker-compose.yml    # Local development
├── docker-compose.prod.yml # Production deployment
├── nginx.conf            # Reverse proxy
└── .env.example          # Environment template
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Anthropic API key
- Pasabayan API access

### Local Development

1. Clone and setup:
```bash
cd pasabayan-ai-chat
cp .env.example .env
# Edit .env with your values
```

2. Install dependencies:
```bash
cd mcp-server && npm install && cd ..
cd chat-backend && npm install && cd ..
cd chat-frontend && npm install && cd ..
```

3. Start services:
```bash
# Option 1: Docker Compose (recommended)
docker-compose up

# Option 2: Run individually
cd mcp-server && npm run dev &
cd chat-backend && npm run dev &
cd chat-frontend && npm run dev &
```

4. Open http://localhost:3000

### Production Deployment

1. Configure environment:
```bash
cp .env.example .env
# Edit with production values
```

2. Setup SSL certificates:
```bash
mkdir -p ssl
# Add fullchain.pem and privkey.pem from Let's Encrypt
```

3. Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PASABAYAN_API_URL` | Laravel API URL | Yes |
| `PASABAYAN_ADMIN_TOKEN` | Admin API token | Yes |
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `MCP_ACCESS_TOKEN` | Internal MCP auth token | Yes |
| `ADMIN_API_TOKEN` | Web UI admin token | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `NEXT_PUBLIC_API_URL` | API URL for browser | Yes |

See `.env.example` for all options.

## API Reference

### Chat Endpoint

```
POST /api/chat
Content-Type: application/json
Authorization: Bearer <user-token>  # For user mode
X-Admin-Token: <admin-token>        # For admin mode

{
  "message": "Show me active trips from Manila",
  "conversationId": "optional-conversation-id"
}

Response:
{
  "message": "I found 5 active trips from Manila...",
  "conversationId": "conv_abc123",
  "toolsUsed": ["search_trips"],
  "mode": "admin"
}
```

### Streaming Endpoint

```
POST /api/chat/stream
Content-Type: application/json

(Same body as above)

Response: Server-Sent Events stream
```

### Health Check

```
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2026-02-05T10:00:00Z",
  "services": {
    "mcp": true,
    "claude": true
  }
}
```

## Available AI Tools

| Tool | Description | Auth |
|------|-------------|------|
| `search_trips` | Find carrier trips | Any |
| `search_packages` | Find package requests | Any |
| `get_trip` | Get trip details | Any |
| `get_package` | Get package details | Any |
| `get_match` | Get match details | Owner/Admin |
| `list_matches` | List matches | Any |
| `get_user_profile` | Get user profile | Admin |
| `get_my_profile` | Get own profile | User |
| `get_carrier_stats` | Carrier performance | Any |
| `get_platform_stats` | Platform statistics | Admin |

## iOS Integration

See [ios-sdk/README.md](ios-sdk/README.md) for SwiftUI integration instructions.

Quick example:
```swift
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var userSession: UserSession

    var body: some View {
        ChatView(
            baseURL: "https://ask.pasabayan.com",
            authToken: userSession.sanctumToken
        )
    }
}
```

## Security

- All API requests require authentication
- Admin mode requires separate admin token
- User mode scoped to authenticated user's data only
- Rate limiting: 100 req/min (admin), 30 req/min (user)
- CORS restricted to known origins
- Input sanitization before Claude API calls

## Monitoring

- Health endpoints for all services
- Docker health checks configured
- JSON logging with rotation
- Request logging (optional)

## Development

### Running Tests

```bash
cd mcp-server && npm test
cd chat-backend && npm test
cd chat-frontend && npm test
```

### Building Images

```bash
docker-compose build
```

### Viewing Logs

```bash
docker-compose logs -f chat-backend
```

## Troubleshooting

### Common Issues

1. **Connection refused to MCP server**
   - Ensure MCP server is running
   - Check `MCP_ACCESS_TOKEN` matches between services

2. **Claude API errors**
   - Verify `ANTHROPIC_API_KEY` is valid
   - Check API rate limits

3. **Auth errors in user mode**
   - Ensure Pasabayan API URL is correct
   - Verify user's Sanctum token is valid

4. **CORS errors**
   - Check `FRONTEND_URL` matches actual frontend origin

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

Proprietary - Pasabayan
