import { Router } from "express";
import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});
pgClient.connect();

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        symbol,
        last_price as "lastPrice",
        price_change_24h as "priceChange24h",
        price_change_percentage_24h as "priceChangePercentage24h",
        high_price_24h as "highPrice24h",
        low_price_24h as "lowPrice24h",
        volume_24h as "volume24h",
        quote_volume_24h as "quoteVolume24h"
      FROM tickers
    `;
    const result = await pgClient.query(query);

    const transformedRows = result.rows.map((row) => ({
      symbol: row.symbol,
      firstPrice: row.lastPrice.toString(),
      high: row.highPrice24h.toString(),
      lastPrice: row.lastPrice.toString(),
      low: row.lowPrice24h.toString(),
      priceChange: row.priceChange24h.toString(),
      priceChangePercent: row.priceChangePercentage24h.toString(),
      quoteVolume: row.quoteVolume24h.toString(),
      trades: "0", // We don't track this currently
      volume: row.volume24h.toString(),
    }));

    res.json(transformedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
