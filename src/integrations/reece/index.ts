import {
  REECE_API_BASE_URL,
  REECE_API_SCOPE,
  REECE_AUTH_TOKEN_URL,
  REECE_CLIENT_ID,
  REECE_CLIENT_SECRET,
  REECE_DEFAULT_CUSTOMER_NUMBER,
  REECE_DEFAULT_CUSTOMER_TOKEN,
  REECE_DEFAULT_REGION,
} from "../../config/env";
import { ReeceApiClient, ReeceClientOptions, ReeceRegion } from "./reeceClient";

let client: ReeceApiClient | undefined;

const parseRegion = (value?: string | null): ReeceRegion | undefined => {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  return lower === "au" || lower === "nz" ? (lower as ReeceRegion) : undefined;
};

const buildClient = (): ReeceApiClient => {
  if (!REECE_CLIENT_ID || !REECE_CLIENT_SECRET) {
    throw new Error("Reece API credentials are not configured (missing REECE_CLIENT_ID or REECE_CLIENT_SECRET)");
  }
  if (!REECE_AUTH_TOKEN_URL) {
    throw new Error("Reece auth token URL is not configured (missing REECE_AUTH_TOKEN_URL)");
  }
  if (!REECE_API_BASE_URL) {
    throw new Error("Reece API base URL is not configured (missing REECE_API_BASE_URL)");
  }

  const options: ReeceClientOptions = {
    clientId: REECE_CLIENT_ID,
    clientSecret: REECE_CLIENT_SECRET,
    tokenUrl: REECE_AUTH_TOKEN_URL,
    apiBaseUrl: REECE_API_BASE_URL,
    defaultScope: REECE_API_SCOPE,
    defaultCustomerToken: REECE_DEFAULT_CUSTOMER_TOKEN,
    defaultCustomerNumber: REECE_DEFAULT_CUSTOMER_NUMBER,
    defaultRegion: parseRegion(REECE_DEFAULT_REGION),
  };

  return new ReeceApiClient(options);
};

export const getReeceClient = (): ReeceApiClient => {
  if (!client) {
    client = buildClient();
  }
  return client;
};

export const resolveRegion = (input?: string | null): ReeceRegion => {
  const parsed = parseRegion(input) ?? getReeceClient().region;
  if (!parsed) {
    throw new Error("Reece region is required (expected 'au' or 'nz')");
  }
  return parsed;
};
