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
        const response = await redisClient.rPop("messages" as string)
        if (!response) {

        }  else {
            engine.process(JSON.parse(response));
        }        
    }

}

main();