import { createServer } from "http";
import app from "./app.js";

const port = process.env.PORT || 6001;
const httpServer = createServer(app);

if (!process.env.VERCEL) {
  httpServer.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  });
}

export default app; // Vercel usa isto
