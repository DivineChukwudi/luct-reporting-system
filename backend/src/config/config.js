// Configuration settings

const isProduction = process.env.NODE_ENV === "production";

export default {
  jwtSecret: process.env.JWT_SECRET || "luct-reporting-super-secret-key-2025",
  jwtExpiresIn: "24h",

  database: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "luct_reporting",
    password: process.env.DB_PASSWORD || "postgres",
    port: process.env.DB_PORT || 5432,
    ssl: isProduction
      ? { rejectUnauthorized: false } // ✅ Render / Cloud
      : false, // ✅ Localhost
  },
};
