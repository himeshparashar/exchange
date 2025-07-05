import { Client } from 'pg'; 
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
    user: process.env.DB_USER || 'your_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'my_database',
    password: process.env.DB_PASSWORD || 'your_password',
    port: parseInt(process.env.DB_PORT || '5432'),
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