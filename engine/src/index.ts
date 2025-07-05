import { createClient, } from "redis";
import { Engine } from "./trade/Engine";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    const engine = new Engine(); 
    const redisClient = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
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