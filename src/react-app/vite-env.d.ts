/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface Env {
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  DB: D1Database;
}
