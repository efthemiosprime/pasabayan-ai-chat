import Foundation

// MARK: - Models

public struct ChatMessage: Codable, Identifiable {
    public let id: String
    public let role: String
    public let content: String
    public let timestamp: Date
    public var toolsUsed: [String]?

    public init(role: String, content: String, toolsUsed: [String]? = nil) {
        self.id = UUID().uuidString
        self.role = role
        self.content = content
        self.timestamp = Date()
        self.toolsUsed = toolsUsed
    }
}

public struct ChatResponse: Codable {
    public let message: String
    public let conversationId: String
    public let toolsUsed: [String]?
    public let mode: String
}

public struct ChatError: Error, LocalizedError {
    public let message: String
    public let code: String?

    public var errorDescription: String? {
        return message
    }
}

// MARK: - ChatService

/// Service for communicating with the Pasabayan AI Chat backend
public class ChatService: ObservableObject {

    // MARK: - Published Properties

    @Published public private(set) var messages: [ChatMessage] = []
    @Published public private(set) var isLoading = false
    @Published public private(set) var error: ChatError?
    @Published public private(set) var conversationId: String?

    // MARK: - Private Properties

    private let baseURL: String
    private let authToken: String
    private let session: URLSession

    // MARK: - Initialization

    /// Initialize the chat service with the user's auth token
    /// - Parameters:
    ///   - baseURL: The chat backend URL (e.g., "https://ask.pasabayan.com")
    ///   - authToken: The user's Sanctum authentication token
    public init(baseURL: String, authToken: String) {
        self.baseURL = baseURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        self.authToken = authToken

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        config.timeoutIntervalForResource = 120
        self.session = URLSession(configuration: config)
    }

    // MARK: - Public Methods

    /// Send a message to the AI assistant
    /// - Parameter content: The message content
    @MainActor
    public func sendMessage(_ content: String) async {
        guard !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return
        }

        // Add user message immediately
        let userMessage = ChatMessage(role: "user", content: content)
        messages.append(userMessage)

        isLoading = true
        error = nil

        do {
            let response = try await performChatRequest(message: content)

            // Update conversation ID
            conversationId = response.conversationId

            // Add assistant response
            let assistantMessage = ChatMessage(
                role: "assistant",
                content: response.message,
                toolsUsed: response.toolsUsed
            )
            messages.append(assistantMessage)

        } catch let chatError as ChatError {
            self.error = chatError
        } catch {
            self.error = ChatError(message: error.localizedDescription, code: "UNKNOWN")
        }

        isLoading = false
    }

    /// Clear the current conversation and start fresh
    @MainActor
    public func clearConversation() {
        messages.removeAll()
        conversationId = nil
        error = nil
    }

    /// Start a new conversation (keeps history but resets conversation ID)
    @MainActor
    public func newConversation() async {
        do {
            let response = try await performNewConversationRequest()
            conversationId = response.conversationId
            messages.removeAll()
            error = nil
        } catch let chatError as ChatError {
            self.error = chatError
        } catch {
            self.error = ChatError(message: error.localizedDescription, code: "UNKNOWN")
        }
    }

    // MARK: - Private Methods

    private func performChatRequest(message: String) async throws -> ChatResponse {
        guard let url = URL(string: "\(baseURL)/api/chat") else {
            throw ChatError(message: "Invalid URL", code: "INVALID_URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "message": message,
            "conversationId": conversationId as Any
        ].compactMapValues { $0 }

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ChatError(message: "Invalid response", code: "INVALID_RESPONSE")
        }

        if httpResponse.statusCode == 401 {
            throw ChatError(message: "Authentication required. Please log in again.", code: "AUTH_REQUIRED")
        }

        if httpResponse.statusCode == 429 {
            throw ChatError(message: "Too many requests. Please wait a moment.", code: "RATE_LIMITED")
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            if let errorResponse = try? JSONDecoder().decode([String: String].self, from: data),
               let errorMessage = errorResponse["error"] {
                throw ChatError(message: errorMessage, code: errorResponse["code"])
            }
            throw ChatError(message: "Request failed with status \(httpResponse.statusCode)", code: "REQUEST_FAILED")
        }

        let decoder = JSONDecoder()
        return try decoder.decode(ChatResponse.self, from: data)
    }

    private func performNewConversationRequest() async throws -> (conversationId: String, mode: String) {
        guard let url = URL(string: "\(baseURL)/api/chat/new") else {
            throw ChatError(message: "Invalid URL", code: "INVALID_URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw ChatError(message: "Failed to create conversation", code: "REQUEST_FAILED")
        }

        struct NewConversationResponse: Codable {
            let conversationId: String
            let mode: String
        }

        let decoded = try JSONDecoder().decode(NewConversationResponse.self, from: data)
        return (decoded.conversationId, decoded.mode)
    }
}
