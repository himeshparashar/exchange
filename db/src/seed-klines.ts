import { Client } from "pg";
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Market configurations - should match the ones from seed-multiple-markets.ts
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

async function refreshKlineViews() {
  await client.connect();
  console.log("Connected to database for kline seeding");

  for (const market of MARKETS) {
    const tableName = `${market.symbol.toLowerCase()}_prices`;
    
    console.log(`\n=== Processing ${market.symbol} ===`);

    // Check if the base table has data
    const dataCheck = await client.query(`
      SELECT COUNT(*) as count, MIN(time) as min_time, MAX(time) as max_time 
      FROM "${tableName}"
    `);
    
    const dataCount = parseInt(dataCheck.rows[0].count);
    console.log(`Base table ${tableName} has ${dataCount} records`);
    
    if (dataCount === 0) {
      console.log(`⚠️  No data in ${tableName}, generating sample data...`);
      
      // Generate historical data for the last 90 days if table is empty
      const dataPoints = [];
      const now = new Date();
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      
      let currentPrice = market.basePrice;
      
      // Generate data every 1 minute for 90 days (more granular data)
      for (let time = ninetyDaysAgo; time <= now; time = new Date(time.getTime() + 1 * 60 * 1000)) {
        // Simulate realistic price movement
        const randomChange = (Math.random() - 0.5) * 2 * market.volatility * 0.01; // Small incremental changes
        currentPrice = Math.max(currentPrice * (1 + randomChange), market.basePrice * 0.5);
        
        const volume = Math.random() * 500 + 50; // Random volume between 50-550
        
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
        
        if (i % 5000 === 0) {
          console.log(`  Inserted ${i + batch.length}/${dataPoints.length} records...`);
        }
      }
      console.log(`✅ Inserted all ${dataPoints.length} records`);
    } else {
      console.log(`✅ ${tableName} already has data from ${dataCheck.rows[0].min_time} to ${dataCheck.rows[0].max_time}`);
    }

    // Drop existing materialized views
    console.log(`Refreshing materialized views for ${market.symbol}...`);
    
    const views = ['1m', '1h', '1d', '1w'];
    
    for (const interval of views) {
      const viewName = `${tableName}_${interval}`;
      
      // Drop existing view
      await client.query(`DROP MATERIALIZED VIEW IF EXISTS ${viewName};`);
      
      // Create fresh materialized view
      let timeInterval;
      switch (interval) {
        case '1m':
          timeInterval = '1 minute';
          break;
        case '1h':
          timeInterval = '1 hour';
          break;
        case '1d':
          timeInterval = '1 day';
          break;
        case '1w':
          timeInterval = '1 week';
          break;
      }
      
      await client.query(`
        CREATE MATERIALIZED VIEW ${viewName} AS
        SELECT
            time_bucket('${timeInterval}', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM "${tableName}"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      
      // Check the view data
      const viewCheck = await client.query(`SELECT COUNT(*) as count FROM ${viewName};`);
      console.log(`  ${viewName}: ${viewCheck.rows[0].count} records`);
    }
    
    console.log(`✅ Completed kline views for ${market.symbol}`);
  }

  // Create the old-style views if they don't exist (for backward compatibility)
  console.log('\n=== Creating backward compatibility views ===');
  
  // Drop old views
  await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1m;`);
  await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1h;`);
  await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1w;`);
  await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1d;`);

  // Create union views from all markets (using BTC as primary for now)
  await client.query(`
    CREATE MATERIALIZED VIEW klines_1m AS
    SELECT
        time_bucket('1 minute', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM "btc_usdt_prices"
    GROUP BY bucket, currency_code
    ORDER BY bucket;
  `);

  await client.query(`
    CREATE MATERIALIZED VIEW klines_1h AS
    SELECT
        time_bucket('1 hour', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM "btc_usdt_prices"
    GROUP BY bucket, currency_code
    ORDER BY bucket;
  `);

  await client.query(`
    CREATE MATERIALIZED VIEW klines_1d AS
    SELECT
        time_bucket('1 day', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM "btc_usdt_prices"
    GROUP BY bucket, currency_code
    ORDER BY bucket;
  `);

  await client.query(`
    CREATE MATERIALIZED VIEW klines_1w AS
    SELECT
        time_bucket('1 week', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM "btc_usdt_prices"
    GROUP BY bucket, currency_code
    ORDER BY bucket;
  `);

  console.log('✅ Backward compatibility views created');

  await client.end();
  console.log("\n🎉 Kline data seeding completed successfully!");
  console.log("\nYou can now:");
  console.log("1. Start your API server");
  console.log("2. Test the kline endpoint: GET /api/v1/klines?symbol=BTC_USDT&interval=1h&startTime=1609459200&endTime=1735689600");
  console.log("3. Check your frontend - it should now display charts!");
}

refreshKlineViews().catch(console.error);
