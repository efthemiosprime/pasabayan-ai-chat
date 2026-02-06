import SwiftUI

// MARK: - ChatView

/// A complete chat view that can be embedded in any SwiftUI app
public struct ChatView: View {
    @StateObject private var chatService: ChatService
    @State private var inputText = ""
    @FocusState private var isInputFocused: Bool

    /// Initialize the chat view
    /// - Parameters:
    ///   - baseURL: The chat backend URL
    ///   - authToken: The user's authentication token
    public init(baseURL: String, authToken: String) {
        _chatService = StateObject(wrappedValue: ChatService(baseURL: baseURL, authToken: authToken))
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 16) {
                        if chatService.messages.isEmpty {
                            emptyStateView
                        } else {
                            ForEach(chatService.messages) { message in
                                MessageRow(message: message)
                                    .id(message.id)
                            }

                            if chatService.isLoading {
                                LoadingRow()
                            }
                        }
                    }
                    .padding()
                }
                .onChange(of: chatService.messages.count) { _ in
                    withAnimation {
                        if let lastMessage = chatService.messages.last {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Error banner
            if let error = chatService.error {
                ErrorBanner(message: error.message) {
                    chatService.error = nil
                }
            }

            // Input area
            inputArea
        }
        .navigationTitle("AI Assistant")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    Task {
                        await chatService.newConversation()
                    }
                }) {
                    Image(systemName: "plus.message")
                }
            }
        }
    }

    // MARK: - Subviews

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 48))
                .foregroundColor(.blue.opacity(0.6))

            Text("Pasabayan Assistant")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Ask me about your deliveries, trips, packages, or anything else!")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 8) {
                SuggestionButton(text: "Show my active deliveries") {
                    sendMessage("Show my active deliveries")
                }
                SuggestionButton(text: "What's my carrier rating?") {
                    sendMessage("What's my carrier rating?")
                }
                SuggestionButton(text: "Find trips to Cebu") {
                    sendMessage("Find trips to Cebu")
                }
            }
            .padding(.top, 8)
        }
        .padding(.vertical, 40)
    }

    private var inputArea: some View {
        HStack(alignment: .bottom, spacing: 12) {
            TextField("Ask about deliveries...", text: $inputText, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(1...4)
                .focused($isInputFocused)
                .onSubmit {
                    sendMessage(inputText)
                }

            Button(action: {
                sendMessage(inputText)
            }) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title)
                    .foregroundColor(inputText.trimmingCharacters(in: .whitespaces).isEmpty || chatService.isLoading ? .gray : .blue)
            }
            .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty || chatService.isLoading)
        }
        .padding()
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(.separator)),
            alignment: .top
        )
    }

    // MARK: - Actions

    private func sendMessage(_ text: String) {
        guard !text.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        let message = text
        inputText = ""
        isInputFocused = false

        Task {
            await chatService.sendMessage(message)
        }
    }
}

// MARK: - Supporting Views

private struct MessageRow: View {
    let message: ChatMessage

    var isUser: Bool {
        message.role == "user"
    }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            if isUser { Spacer(minLength: 40) }

            VStack(alignment: isUser ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .padding(12)
                    .background(isUser ? Color.blue : Color(.systemGray5))
                    .foregroundColor(isUser ? .white : .primary)
                    .cornerRadius(16)

                if let tools = message.toolsUsed, !tools.isEmpty {
                    Text("Used: \(tools.joined(separator: ", "))")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }

            if !isUser { Spacer(minLength: 40) }
        }
    }
}

private struct LoadingRow: View {
    var body: some View {
        HStack {
            HStack(spacing: 8) {
                ProgressView()
                    .scaleEffect(0.8)
                Text("Thinking...")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding(12)
            .background(Color(.systemGray5))
            .cornerRadius(16)

            Spacer()
        }
    }
}

private struct SuggestionButton: View {
    let text: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(text)
                .font(.subheadline)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color(.systemGray6))
                .cornerRadius(20)
        }
        .foregroundColor(.primary)
    }
}

private struct ErrorBanner: View {
    let message: String
    let onDismiss: () -> Void

    var body: some View {
        HStack {
            Image(systemName: "exclamationmark.triangle")
                .foregroundColor(.red)

            Text(message)
                .font(.subheadline)
                .foregroundColor(.red)

            Spacer()

            Button(action: onDismiss) {
                Image(systemName: "xmark")
                    .foregroundColor(.red)
            }
        }
        .padding()
        .background(Color.red.opacity(0.1))
    }
}

// MARK: - Preview

#Preview {
    NavigationView {
        ChatView(baseURL: "http://localhost:3001", authToken: "preview-token")
    }
}
