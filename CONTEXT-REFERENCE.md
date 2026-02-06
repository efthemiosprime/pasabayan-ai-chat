# Pasabayan AI Chat Project Reference

Use this summary when starting a new Claude Code chat to restore context.

**Location**: `/Users/efthemios/Documents/projects/pasabayan/pasabayan-ai-chat`

**Purpose**: AI chatbot for Pasabayan platform with:
- Admin mode (full platform access via web UI)
- User mode (scoped access via iOS app using Sanctum token)

## Architecture
```
iOS App / Web UI → Chat Backend (Express + Claude API) → MCP Server → Pasabayan Laravel API
```

## Services
| Service | Port | Purpose |
|---------|------|---------|
| `mcp-server` | 3002 | Exposes Pasabayan API as AI tools |
| `chat-backend` | 3001 | Claude API orchestration, auth |
| `chat-frontend` | 3000 | Next.js ChatGPT-like UI |

## Key Files
- **MCP Tools**: `mcp-server/src/tools/*.ts` (trips, packages, matches, users, stats, payments)
- **Claude Integration**: `chat-backend/src/services/claude.ts`
- **Auth Middleware**: `chat-backend/src/middleware/auth.ts` (dual-mode: admin token vs user Sanctum token)
- **iOS SDK**: `ios-sdk/PasabayanChat/ChatService.swift` and `ChatView.swift`

## iOS Integration
```swift
ChatView(
    baseURL: "https://ask.pasabayan.com",
    authToken: userSession.sanctumToken  // Existing Sanctum token
)
```

## Environment Variables Needed
- `ANTHROPIC_API_KEY` - Claude API key
- `PASABAYAN_API_URL` - Laravel API URL
- `PASABAYAN_ADMIN_TOKEN` - Admin API token (generate from Filament admin panel)
- `MCP_ACCESS_TOKEN` - Internal MCP auth
- `ADMIN_API_TOKEN` - Web UI admin login

## Generating PASABAYAN_ADMIN_TOKEN

The admin token is created from the **Pasabayan API admin panel**:

1. Go to **Admin Panel → System → API Tokens** (`/admin/api-token-management`)
2. Select an admin user as token owner
3. Name it "AI Chat Admin Token"
4. Select "Full Admin Access"
5. Click **Generate Token**
6. Copy the token (shown only once!)
7. Add to pasabayan-ai-chat `.env`:
   ```
   PASABAYAN_ADMIN_TOKEN=1|your-token-here
   ```

**Files in pasabayan-api:**
- `app/Filament/Pages/ApiTokenManagement.php`
- `resources/views/filament/pages/api-token-management.blade.php`

## Plan File
Full implementation plan at: `~/.claude/plans/flickering-seeking-stallman.md`

## Status
✅ All files created (39 total), ready for `npm install` and configuration

## Next Steps
1. `cp .env.example .env` and fill in values
2. `cd mcp-server && npm install`
3. `cd chat-backend && npm install`
4. `cd chat-frontend && npm install`
5. `docker-compose up`

## To Continue in New Chat
Tell Claude: "Read /Users/efthemios/Documents/projects/pasabayan/pasabayan-ai-chat/CONTEXT-REFERENCE.md for context on the AI chat project"
