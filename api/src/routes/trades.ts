import { Router } from "express";
import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pgClient = new Client({
  user: process.env.DB_USER || "your_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "my_database",
  password: process.env.DB_PASSWORD || "your_password",
  port: parseInt(process.env.DB_PORT || "5432"),
});
pgClient.connect();

export const tradesRouter = Router();

tradesRouter.get("/", async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol parameter is required" });
    }

    const query = `
      SELECT 
        time as timestamp,
        price,
        volume,
        'buy' as side
      FROM tata_prices 
      WHERE currency_code = $1
      ORDER BY time DESC 
      LIMIT 50
    `;

    const result = await pgClient.query(query, [symbol]);

    // Transform the data to match the Trade interface
    const trades = result.rows.map((row) => ({
      id: row.timestamp.getTime(),
      isBuyerMaker: row.side === "sell",
      price: row.price.toString(),
      quantity: (row.volume || "1").toString(),
      quoteQuantity: (row.price * (row.volume || 1)).toString(),
      timestamp: row.timestamp.getTime(),
    }));

    res.json(trades);
  } catch (err) {
    console.error("Error fetching trades:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
