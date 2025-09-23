import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRATION,
  REECE_CLIENT_ID,
  REECE_CLIENT_SECRET,
  REECE_API_BASE_URL,
  REECE_AUTH_TOKEN_URL,
  REECE_API_SCOPE,
  REECE_DEFAULT_CUSTOMER_TOKEN,
  REECE_DEFAULT_CUSTOMER_NUMBER,
  REECE_DEFAULT_REGION,
} = process.env;
