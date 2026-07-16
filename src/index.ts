import { serve } from "bun";
import index from "./index.html";

const PORT = process.env.PORT || 3000;

const server = serve({
  port: PORT,
  routes: {
    "/": index,
  },
  development: true,
});

console.log(`💻 AI Agency Platform running at http://localhost:${server.port}/`);
