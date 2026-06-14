import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia({ prefix: "/api" })
  .use(cors()) // Enables CORS for local React development on port 3000
  .get("/hello", () => ({
    status: "success",
    message: "Hello from ElysiaJS backend on CodeOrbit!",
    timestamp: new Date().toISOString()
  }));

export default app;
