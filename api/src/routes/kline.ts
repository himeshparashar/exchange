import { Client } from 'pg';
import { Router } from "express";
import { RedisManager } from "../RedisManager";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
});
pgClient.connect();

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    const { symbol, interval, startTime, endTime } = req.query;

    if (!symbol || !interval || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required parameters: symbol, interval, startTime, endTime' });
    }

    // Convert symbol to table name format (e.g., BTC_USDT -> btc_usdt_prices)
    const tableName = `${(symbol as string).toLowerCase()}_prices`;
    
    let query;
    switch (interval) {
        case '1m':
            query = `SELECT * FROM ${tableName}_1m WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 ORDER BY bucket ASC`;
            break;
        case '1h':
            query = `SELECT * FROM ${tableName}_1h WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 ORDER BY bucket ASC`;
            break;
        case '1d':
            query = `SELECT * FROM ${tableName}_1d WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 ORDER BY bucket ASC`;
            break;
        case '1w':
            query = `SELECT * FROM ${tableName}_1w WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 ORDER BY bucket ASC`;
            break;
        default:
            return res.status(400).json({ error: 'Invalid interval. Supported: 1m, 1h, 1d, 1w' });
    }

    try {
        const startDate = new Date(parseInt(startTime as string) * 1000);
        const endDate = new Date(parseInt(endTime as string) * 1000);
        
        console.log(`Querying klines for ${symbol} from ${startDate} to ${endDate} with interval ${interval}`);
        
        const result = await pgClient.query(query, [startDate, endDate, symbol]);
        
        console.log(`Found ${result.rows.length} kline records`);
        
        const klines = result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.volume * x.close, // Calculate quote volume
            start: x.bucket,
            trades: 1, // Default trades count
            volume: x.volume,
        }));
        
        res.json(klines);
    } catch (err) {
        console.error('Kline query error:', err);
        res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' });
    }
});