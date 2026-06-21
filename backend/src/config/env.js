import dotenv from "dotenv";
dotenv.config();
function getEnvVar(key, defaultValue) {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
export const env = {
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  MONGODB_URI: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/coldmail-agent"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),
  GROQ_API_KEY: getEnvVar("GROQ_API_KEY"),
  SMTP_HOST: getEnvVar("SMTP_HOST", "smtp.gmail.com"),
  SMTP_PORT: parseInt(getEnvVar("SMTP_PORT", "587"), 10),
  SMTP_USER: getEnvVar("SMTP_USER"),
  SMTP_PASS: getEnvVar("SMTP_PASS"),
  FROM_EMAIL: getEnvVar("FROM_EMAIL"),
  FROM_NAME: getEnvVar("FROM_NAME", "ColdMail AI Agent")
};
