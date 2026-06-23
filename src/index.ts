import { serve } from "bun";
import index from "./index.html";

const PORT = process.env.PORT || 3000;

console.log(`🚀 .NET Backend should be running separately at http://localhost:5000`);

// Start React Frontend locally on port 3000
const server = serve({
  port: PORT,
  routes: {
    "/": index,
  },
  development: true,
});

console.log(`💻 React Frontend running at http://localhost:${server.port}/`);
