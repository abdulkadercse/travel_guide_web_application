import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${key}. Copy server/.env.example to server/.env and fill it in.`
    );
  }
  return value;
};

const optional = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value : fallback;
};

export const config = {
  env: optional("NODE_ENV", "development"),
  isProduction: optional("NODE_ENV", "development") === "production",
  port: Number(optional("PORT", "5001")),
  clientUrl: optional("CLIENT_URL", "http://localhost:3000"),

  databaseUrl: required("DATABASE_URL"),

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: optional("JWT_EXPIRES_IN", "7d"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    refreshExpiresIn: optional("JWT_REFRESH_EXPIRES_IN", "30d"),
    resetSecret: optional("JWT_RESET_SECRET", required("JWT_SECRET") + "_reset"),
    resetExpiresIn: optional("JWT_RESET_EXPIRES_IN", "15m"),
  },

  bcryptSaltRounds: Number(optional("BCRYPT_SALT_ROUNDS", "12")),

  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
} as const;

export default config;
