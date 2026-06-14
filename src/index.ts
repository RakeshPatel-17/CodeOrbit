import { serve } from "bun";
import index from "./index.html";

// Fall back to 3001 if port 3000 is locked by another instance
const PORT = process.env.PORT || 3000;

const server = serve({
  port: PORT,
  routes: {
    "/": index,
  },
  development: true,
});

console.log(`?? System Server running at http://localhost:${server.port}/`);
