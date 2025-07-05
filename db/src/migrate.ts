import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function migrate() {
  const pgClient = new Client({
    user: process.env.DB_USER || "your_user",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "my_database",
    password: process.env.DB_PASSWORD || "your_password",
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  try {
    await pgClient.connect();
    console.log("Connected to database");

    await pgClient.query(`
      DROP TABLE IF EXISTS tickers;
      
      CREATE TABLE tickers (
        symbol VARCHAR(20) PRIMARY KEY,
        last_price DECIMAL(20, 8) NOT NULL,
        price_change_24h DECIMAL(20, 8),
        price_change_percentage_24h DECIMAL(10, 2),
        high_price_24h DECIMAL(20, 8),
        low_price_24h DECIMAL(20, 8),
        volume_24h DECIMAL(20, 8) DEFAULT 0,
        quote_volume_24h DECIMAL(20, 8) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Successfully recreated tickers table");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pgClient.end();
  }
}

migrate();
