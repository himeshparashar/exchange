import { Client } from "pg";
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Market configurations with realistic price ranges
const MARKETS = [
    { symbol: "BTC_USDT", basePrice: 45000, volatility: 0.05 },
    { symbol: "ETH_USDT", basePrice: 2800, volatility: 0.07 },
    { symbol: "SOL_USDT", basePrice: 180, volatility: 0.12 },
    { symbol: "MATIC_USDT", basePrice: 0.85, volatility: 0.15 },
    { symbol: "AVAX_USDT", basePrice: 28, volatility: 0.10 },
    { symbol: "DOT_USDT", basePrice: 6.5, volatility: 0.08 },
    { symbol: "LINK_USDT", basePrice: 14, volatility: 0.09 },
    { symbol: "ADA_USDT", basePrice: 0.45, volatility: 0.13 },
    { symbol: "XRP_USDT", basePrice: 0.52, volatility: 0.11 },
    { symbol: "DOGE_USDT", basePrice: 0.08, volatility: 0.18 }
];

async function seedMarketData() {
  await client.connect();
  console.log("Connected to database");

  // Create tables for each market if they don't exist
  for (const market of MARKETS) {
    const tableName = `${market.symbol.toLowerCase()}_prices`;
    
    console.log(`Creating table: ${tableName}`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        time            TIMESTAMP WITH TIME ZONE NOT NULL,
        price   DOUBLE PRECISION,
        volume      DOUBLE PRECISION,
        currency_code   VARCHAR (10)
      );
    `);

    // Generate historical data for the last 30 days
    const dataPoints = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let currentPrice = market.basePrice;
    
    // Generate data every 5 minutes for 30 days
    for (let time = thirtyDaysAgo; time <= now; time = new Date(time.getTime() + 5 * 60 * 1000)) {
      // Simulate realistic price movement
      const randomChange = (Math.random() - 0.5) * 2 * market.volatility * 0.1; // Smaller incremental changes
      currentPrice = Math.max(currentPrice * (1 + randomChange), market.basePrice * 0.5); // Prevent negative prices
      
      const volume = Math.random() * 1000 + 100; // Random volume between 100-1100
      
      dataPoints.push({
        time: time.toISOString(),
        price: currentPrice,
        volume: volume,
        currency_code: market.symbol
      });
    }

    // Insert data in batches
    console.log(`Inserting ${dataPoints.length} data points for ${market.symbol}`);
    
    for (let i = 0; i < dataPoints.length; i += 1000) {
      const batch = dataPoints.slice(i, i + 1000);
      const values = batch.map(d => 
        `('${d.time}', ${d.price}, ${d.volume}, '${d.currency_code}')`
      ).join(',');
      
      await client.query(`
        INSERT INTO "${tableName}" (time, price, volume, currency_code) 
        VALUES ${values}
        ON CONFLICT DO NOTHING;
      `);
    }

    // Create hypertable (TimescaleDB)
    try {
      await client.query(`SELECT create_hypertable('${tableName}', 'time', 'price', 2);`);
      console.log(`Created hypertable for ${tableName}`);
    } catch (error) {
      console.log(`Hypertable for ${tableName} may already exist`);
    }

    // Create materialized views for different timeframes
    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableName}_1m AS
      SELECT
          time_bucket('1 minute', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "${tableName}"
      GROUP BY bucket, currency_code;
    `);

    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableName}_1h AS
      SELECT
          time_bucket('1 hour', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "${tableName}"
      GROUP BY bucket, currency_code;
    `);

    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableName}_1d AS
      SELECT
          time_bucket('1 day', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "${tableName}"
      GROUP BY bucket, currency_code;
    `);

    console.log(`✅ Completed setup for ${market.symbol}`);
  }

  // Now populate the tickers table so the API can see these markets
  console.log('\n=== Populating tickers table ===');
  
  for (const market of MARKETS) {
    const tableName = `${market.symbol.toLowerCase()}_prices`;
    
    // Get the latest price data to populate ticker
    const latestData = await client.query(`
      SELECT 
        price as last_price,
        volume,
        time
      FROM "${tableName}" 
      ORDER BY time DESC 
      LIMIT 1
    `);

    // Get 24h ago price for change calculation
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dayAgoData = await client.query(`
      SELECT price as first_price
      FROM "${tableName}" 
      WHERE time >= $1
      ORDER BY time ASC 
      LIMIT 1
    `, [oneDayAgo]);

    // Get 24h high and low
    const dayStats = await client.query(`
      SELECT 
        MAX(price) as high,
        MIN(price) as low,
        SUM(volume) as total_volume,
        COUNT(*) as trades
      FROM "${tableName}" 
      WHERE time >= $1
    `, [oneDayAgo]);

    if (latestData.rows.length > 0) {
      const latest = latestData.rows[0];
      const dayAgo = dayAgoData.rows[0] || { first_price: latest.last_price };
      const stats = dayStats.rows[0];
      
      const priceChange = latest.last_price - dayAgo.first_price;
      const priceChangePercent = ((priceChange / dayAgo.first_price) * 100).toFixed(2);

      // Insert or update ticker
      await client.query(`
        INSERT INTO tickers (symbol, last_price, price_change_24h, price_change_percentage_24h, high_price_24h, low_price_24h, volume_24h, quote_volume_24h)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (symbol) 
        DO UPDATE SET
          last_price = EXCLUDED.last_price,
          price_change_24h = EXCLUDED.price_change_24h,
          price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
          high_price_24h = EXCLUDED.high_price_24h,
          low_price_24h = EXCLUDED.low_price_24h,
          volume_24h = EXCLUDED.volume_24h,
          quote_volume_24h = EXCLUDED.quote_volume_24h,
          updated_at = CURRENT_TIMESTAMP
      `, [
        market.symbol,
        latest.last_price,
        priceChange,
        priceChangePercent,
        stats.high,
        stats.low,
        stats.total_volume,
        stats.total_volume * latest.last_price // quote volume (volume * price)
      ]);

      console.log(`✅ Added ${market.symbol} to tickers table - Price: $${latest.last_price.toFixed(6)}, Change: ${priceChangePercent}%`);
    }
  }

  console.log('✅ Tickers table populated successfully');

  await client.end();
  console.log("✅ Database seeding completed successfully");
}

seedMarketData().catch(console.error);
