# Pasabayan Chat iOS SDK

SwiftUI components for integrating the Pasabayan AI Chat assistant into your iOS app.

## Installation

### Swift Package Manager (Recommended)

Add the following to your `Package.swift`:

```swift
dependencies: [
    .package(path: "../pasabayan-ai-chat/ios-sdk")
]
```

Or copy the `PasabayanChat` folder directly into your Xcode project.

### Manual Installation

1. Copy `PasabayanChat/ChatService.swift` and `PasabayanChat/ChatView.swift` to your project
2. Add them to your target

## Usage

### Basic Integration

```swift
import SwiftUI

struct ContentView: View {
    // Get the auth token from your existing authentication system
    @EnvironmentObject var userSession: UserSession

    var body: some View {
        NavigationView {
            ChatView(
                baseURL: "https://ask.pasabayan.com",
                authToken: userSession.sanctumToken
            )
        }
    }
}
```

### Using ChatService Directly

For more control, use `ChatService` directly:

```swift
import SwiftUI

struct CustomChatView: View {
    @StateObject private var chatService: ChatService
    @State private var input = ""

    init(authToken: String) {
        _chatService = StateObject(wrappedValue: ChatService(
            baseURL: "https://ask.pasabayan.com",
            authToken: authToken
        ))
    }

    var body: some View {
        VStack {
            // Display messages
            ScrollView {
                ForEach(chatService.messages) { message in
                    MessageView(message: message)
                }
            }

            // Loading indicator
            if chatService.isLoading {
                ProgressView()
            }

            // Error display
            if let error = chatService.error {
                Text(error.message)
                    .foregroundColor(.red)
            }

            // Input
            HStack {
                TextField("Ask something...", text: $input)
                Button("Send") {
                    Task {
                        await chatService.sendMessage(input)
                        input = ""
                    }
                }
            }
        }
    }
}
```

### Navigation Integration

Embed the chat in your existing navigation:

```swift
struct MainView: View {
    @EnvironmentObject var userSession: UserSession

    var body: some View {
        TabView {
            // Your existing tabs...

            NavigationView {
                ChatView(
                    baseURL: "https://ask.pasabayan.com",
                    authToken: userSession.sanctumToken
                )
            }
            .tabItem {
                Label("Assistant", systemImage: "bubble.left.and.bubble.right")
            }
        }
    }
}
```

### Present as Sheet

```swift
struct DeliveryDetailView: View {
    @State private var showChat = false
    @EnvironmentObject var userSession: UserSession

    var body: some View {
        VStack {
            // Your content...

            Button("Ask Assistant") {
                showChat = true
            }
        }
        .sheet(isPresented: $showChat) {
            NavigationView {
                ChatView(
                    baseURL: "https://ask.pasabayan.com",
                    authToken: userSession.sanctumToken
                )
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Close") {
                            showChat = false
                        }
                    }
                }
            }
        }
    }
}
```

## Configuration

### Environment Variables

Set the chat backend URL in your app's configuration:

```swift
enum AppConfig {
    static var chatBaseURL: String {
        #if DEBUG
        return "http://localhost:3001"
        #else
        return "https://ask.pasabayan.com"
        #endif
    }
}
```

### Customization

The `ChatView` can be customized by wrapping it:

```swift
struct ThemedChatView: View {
    let authToken: String

    var body: some View {
        ChatView(baseURL: AppConfig.chatBaseURL, authToken: authToken)
            .tint(.green) // Custom tint color
            .navigationTitle("Help & Support")
    }
}
```

## API Reference

### ChatService

| Property | Type | Description |
|----------|------|-------------|
| `messages` | `[ChatMessage]` | All messages in the conversation |
| `isLoading` | `Bool` | Whether a request is in progress |
| `error` | `ChatError?` | The last error, if any |
| `conversationId` | `String?` | Current conversation ID |

| Method | Description |
|--------|-------------|
| `sendMessage(_:)` | Send a message to the assistant |
| `clearConversation()` | Clear all messages and reset |
| `newConversation()` | Start a new conversation |

### ChatMessage

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String` | Unique message ID |
| `role` | `String` | "user" or "assistant" |
| `content` | `String` | Message text |
| `timestamp` | `Date` | When the message was created |
| `toolsUsed` | `[String]?` | Tools used (assistant only) |

## Error Handling

```swift
if let error = chatService.error {
    switch error.code {
    case "AUTH_REQUIRED":
        // User needs to log in again
        userSession.logout()
    case "RATE_LIMITED":
        // Show rate limit message
        showAlert("Please wait a moment before sending another message")
    default:
        // Generic error
        showAlert(error.message)
    }
}
```

## Requirements

- iOS 15.0+
- Swift 5.5+
- Xcode 14.0+

## Support

For issues with the chat SDK, please file an issue in the pasabayan-ai-chat repository.
