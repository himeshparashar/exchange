import { Client } from 'pg'; 
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();

async function refreshViews() {

    await client.query('REFRESH MATERIALIZED VIEW klines_1m');
    await client.query('REFRESH MATERIALIZED VIEW klines_1h');
    await client.query('REFRESH MATERIALIZED VIEW klines_1w');

    console.log("Materialized views refreshed successfully");
}

refreshViews().catch(console.error);

setInterval(() => {
    refreshViews()
}, 1000 * 10 );