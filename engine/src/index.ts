import { createClient, } from "redis";
import { Engine } from "./trade/Engine";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    const engine = new Engine(); 
    const redisClient = createClient({
        url: process.env.REDIS_URL || `redis://localhost:6379`,
        socket: {
            tls: true
        }
    });
    await redisClient.connect();
    console.log("connected to redis");

    while (true) {
        // Use blocking pop with 5 second timeout to avoid constant polling
        const response = await redisClient.brPop("messages", 5);
        if (!response) {
            // Timeout occurred, continue (this gives us a chance to handle shutdown gracefully)
            continue;
        } else {
            const messageData = response.element;
            console.log(`Processing message: ${messageData}`);
            engine.process(JSON.parse(messageData));
        }        
    }

}

main();