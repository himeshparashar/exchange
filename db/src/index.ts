import { Client } from "pg";
import { createClient } from "redis";
import type { DbMessage } from "./types";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("Connecting to PostgreSQL database...");
pgClient.connect()
  .then(() => console.log("Successfully connected to PostgreSQL"))
  .catch(err => console.error("Failed to connect to PostgreSQL:", err));

async function updateTickerFromTrade(
  market: string,
  price: number,
  quantity: number
) {
  console.log(`updateTickerFromTrade called - Market: ${market}, Price: ${price}, Quantity: ${quantity}`);
  // First get the current ticker data
  const currentTickerQuery = `
    SELECT * FROM tickers WHERE symbol = $1
  `;
  const currentTicker = await pgClient.query(currentTickerQuery, [market]);
  console.log(`Found ${currentTicker.rows.length} existing ticker records for ${market}`);

  if (currentTicker.rows.length === 0) {
    // If no ticker exists, create initial ticker data
    console.log(`Creating new ticker for ${market}`);
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
    console.log(`Successfully created new ticker for ${market}`);
  } else {
    // Update existing ticker
    const ticker = currentTicker.rows[0];
    console.log(`Updating existing ticker for ${market} - Previous price: ${ticker.last_price}, New price: ${price}`);
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
    console.log(`Successfully updated ticker for ${market}`);
  }
}

async function main() {
  console.log("Starting database processor...");
  const redisClient = createClient({
    url: process.env.REDIS_URL || `redis://localhost:6379`
  });
  
  console.log("Connecting to Redis...");
  await redisClient.connect();
  console.log("Connected to Redis successfully");

  console.log("Starting message processing loop...");
  let messageCount = 0;
  
  while (true) {
    const response = await redisClient.rPop("db_processor" as string);
    if (!response) {
      // No message available, continue polling
    } else {
      messageCount++;
      console.log(`Processing message #${messageCount}: ${response}`);
      
      try {
        const data: DbMessage = JSON.parse(response);
        console.log(`Parsed message type: ${data.type}`);

        if (data.type === "TRADE_ADDED") {
          console.log("Processing TRADE_ADDED message");
          console.log("Trade data:", data);
          
          const tradeData = data.data;
          const price = Number.parseFloat(tradeData.price);
          const quantity = Number.parseFloat(tradeData.quantity);
          const timestamp = new Date(tradeData.timestamp);

          console.log(`Parsed trade values - Price: ${price}, Quantity: ${quantity}, Timestamp: ${timestamp.toISOString()}, Market: ${tradeData.market}`);

          // Update trade history with more information
          console.log("Inserting trade into tata_prices table...");
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
          console.log("Successfully inserted trade into tata_prices table");

          // Update ticker data
          console.log("Updating ticker data...");
          await updateTickerFromTrade(tradeData.market, price, quantity);
          console.log("Successfully updated ticker data");
          
          console.log(`Completed processing message #${messageCount}`);
        } else {
          console.log(`Ignoring message type: ${data.type}`);
        }
      } catch (error) {
        console.error(`Error processing message #${messageCount}:`, error);
        console.error("Raw message:", response);
      }
    }
  }
}

main();
