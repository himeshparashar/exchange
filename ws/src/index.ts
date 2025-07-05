import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const port = parseInt(process.env.WS_PORT || "3001");
const wss = new WebSocketServer({ port });

console.log(`WebSocket server is running on port ${port}`);

wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws);
});

