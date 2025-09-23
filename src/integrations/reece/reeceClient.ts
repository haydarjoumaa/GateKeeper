import { Buffer } from "node:buffer";

export type ReeceRegion = "au" | "nz";

export interface ReeceClientOptions {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  apiBaseUrl: string;
  defaultScope?: string;
  defaultCustomerToken?: string;
  defaultCustomerNumber?: string;
  defaultRegion?: ReeceRegion;
  tokenExpiryLeewaySeconds?: number;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

export interface ProductSearchParams {
  region: ReeceRegion;
  searchPhrase: string;
  pageNumber?: number;
  pageSize?: number;
  customerToken?: string;
  customerNumber?: string;
}

export interface BranchesParams {
  region: ReeceRegion;
  customerToken?: string;
  customerNumber?: string;
}

export class ReeceApiClient {
  private readonly apiBaseUrl: string;
  private readonly tokenUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly defaultScope: string;
  private readonly defaultCustomerToken?: string;
  private readonly defaultCustomerNumber?: string;
  private readonly defaultRegion?: ReeceRegion;
  private readonly tokenExpiryLeeway: number;
  private cachedToken?: CachedToken;

  constructor(options: ReeceClientOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.tokenUrl = options.tokenUrl.replace(/\/$/, "");
    this.apiBaseUrl = options.apiBaseUrl.replace(/\/$/, "");
    this.defaultScope = options.defaultScope ?? "Default/read Default/write";
    this.defaultCustomerToken = options.defaultCustomerToken;
    this.defaultCustomerNumber = options.defaultCustomerNumber;
    this.defaultRegion = options.defaultRegion;
    this.tokenExpiryLeeway = Math.max(10, options.tokenExpiryLeewaySeconds ?? 30);
  }

  get region(): ReeceRegion | undefined {
    return this.defaultRegion;
  }

  async searchProducts<T = unknown>(params: ProductSearchParams): Promise<T> {
    const { region, searchPhrase, pageNumber, pageSize, customerNumber, customerToken } = params;
    if (!searchPhrase || searchPhrase.length < 3 || searchPhrase.length > 30) {
      throw new Error("searchPhrase must be between 3 and 30 characters");
    }
    const query = new URLSearchParams({ searchPhrase });
    if (pageNumber !== undefined) query.set("pageNumber", String(pageNumber));
    if (pageSize !== undefined) query.set("pageSize", String(pageSize));

    return this.request<T>(
      `/${region}/product-gateway/search?${query.toString()}`,
      {
        method: "GET",
      },
      { customerNumber, customerToken }
    );
  }

  async getBranches<T = unknown>(params: BranchesParams): Promise<T> {
    const { region, customerNumber, customerToken } = params;
    return this.request<T>(
      `/${region}/branches`,
      { method: "GET" },
      { customerNumber, customerToken }
    );
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    customerContext?: { customerToken?: string; customerNumber?: string }
  ): Promise<T> {
    const url = new URL(path, `${this.apiBaseUrl}/`);
    const token = await this.getAccessToken();
    const headers = new Headers(init.headers ?? {});
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", headers.get("Accept") ?? "application/json");
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    const customerToken = customerContext?.customerToken ?? this.defaultCustomerToken;
    const customerNumber = customerContext?.customerNumber ?? this.defaultCustomerNumber;

    if (customerToken) {
      headers.set("Customer-Token", customerToken);
    } else if (customerNumber) {
      headers.set("Customer-Number", customerNumber);
    }

    const response = await fetch(url, { ...init, headers });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Reece API request failed (${response.status}): ${text}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  private async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.accessToken;
    }

    const authorization = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: this.defaultScope,
    });

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authorization}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`Failed to acquire Reece access token (${response.status}): ${errorPayload}`);
    }

    const json = (await response.json()) as { access_token?: string; expires_in?: number; token_type?: string };
    if (!json.access_token) {
      throw new Error("Reece auth server response missing access_token");
    }

    const expiresInSeconds = typeof json.expires_in === "number" ? json.expires_in : 300;
    const expiry = Date.now() + Math.max(30, expiresInSeconds - this.tokenExpiryLeeway) * 1000;

    this.cachedToken = {
      accessToken: json.access_token,
      expiresAt: expiry,
    };

    return json.access_token;
  }
}
