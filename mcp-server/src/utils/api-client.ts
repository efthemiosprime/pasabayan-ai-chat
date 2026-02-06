/**
 * Pasabayan API Client
 * Handles all HTTP requests to the Pasabayan Laravel API
 */

export interface ApiClientConfig {
  baseUrl: string;
  token: string;
  isAdminToken: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export class ApiClient {
  private baseUrl: string;
  private token: string;
  private isAdminToken: boolean;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
    this.isAdminToken = config.isAdminToken;
  }

  /**
   * Make an authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, { method: "GET" });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Check if client has admin privileges
   */
  isAdmin(): boolean {
    return this.isAdminToken;
  }

  /**
   * Get the base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Create an API client from environment or request tokens
 */
export function createApiClient(
  token: string,
  isAdminToken: boolean = false
): ApiClient {
  const baseUrl = process.env.PASABAYAN_API_URL;

  if (!baseUrl) {
    throw new Error("PASABAYAN_API_URL environment variable is required");
  }

  return new ApiClient({
    baseUrl,
    token,
    isAdminToken,
  });
}
