import { serve } from "bun";
import index from "./index.html";
import app from "../api/index";

const PORT = process.env.PORT || 3000;
const API_PORT = 3001;

// Start ElysiaJS Backend locally on port 3001
const apiServer = app.listen(API_PORT);
console.log(`🚀 ElysiaJS Backend running at http://localhost:${apiServer.port}/api`);

// Start React Frontend locally on port 3000
const server = serve({
  port: PORT,
  routes: {
    "/": index,
  },
  development: true,
});

console.log(`💻 React Frontend running at http://localhost:${server.port}/`);
