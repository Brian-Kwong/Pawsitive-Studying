import app from "./backend.js";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;

// Binds socket to port
const server = async () =>
    app.listen(port, () => {
        console.log(`REST API  is listening at ${port}`);
    });

// Starts server
server();

// Lambda handler
const handler = serverless(app);
export async function handleStart(context, req) {
    const res = await handler(context, req);
    return res;
}
