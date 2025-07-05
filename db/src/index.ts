import { Client } from "pg";
import { createClient } from "redis";
import type { DbMessage } from "./types";
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

async function updateTickerFromTrade(
  market: string,
  price: number,
  quantity: number
) {
  // First get the current ticker data
  const currentTickerQuery = `
    SELECT * FROM tickers WHERE symbol = $1
  `;
  const currentTicker = await pgClient.query(currentTickerQuery, [market]);

  if (currentTicker.rows.length === 0) {
    // If no ticker exists, create initial ticker data
    const query = `
      INSERT INTO tickers (
        symbol,
        last_price,
        price_change_24h,
        price_change_percentage_24h,
        high_price_24h,
        low_price_24h,
        volume_24h,
        quote_volume_24h
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await pgClient.query(query, [
      market,
      price,
      0, // price_change_24h
      0, // price_change_percentage_24h
      price, // high_price_24h
      price, // low_price_24h
      quantity, // volume_24h
      price * quantity, // quote_volume_24h
    ]);
  } else {
    // Update existing ticker
    const ticker = currentTicker.rows[0];
    const query = `
      UPDATE tickers SET
        last_price = $2,
        high_price_24h = GREATEST(high_price_24h, $2),
        low_price_24h = LEAST(low_price_24h, $2),
        volume_24h = volume_24h + $3,
        quote_volume_24h = quote_volume_24h + $4,
        price_change_24h = $2 - last_price,
        price_change_percentage_24h = ($2 - last_price) / last_price * 100,
        updated_at = CURRENT_TIMESTAMP
      WHERE symbol = $1
    `;

    await pgClient.query(query, [market, price, quantity, price * quantity]);
  }
}

async function main() {
  const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
  });
  await redisClient.connect();
  console.log("connected to redis");

  while (true) {
    const response = await redisClient.rPop("db_processor" as string);
    if (!response) {
    } else {
      const data: DbMessage = JSON.parse(response);

      if (data.type === "TRADE_ADDED") {
        console.log("adding data");
        console.log(data);
        const tradeData = data.data;
        const price = Number.parseFloat(tradeData.price);
        const quantity = Number.parseFloat(tradeData.quantity);
        const timestamp = new Date(tradeData.timestamp);

        // Update trade history with more information
        const query = `
          INSERT INTO tata_prices (
            time, 
            price, 
            volume,
            currency_code
          ) VALUES ($1, $2, $3, $4)
        `;
        const values = [timestamp, price, quantity, tradeData.market];
        await pgClient.query(query, values);

        // Update ticker data
        await updateTickerFromTrade(tradeData.market, price, quantity);
      }
    }
  }
}

main();
