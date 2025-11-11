import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import midiasRouter from "./routes/midias.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// === Rotas estáticas ===
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    maxAge: 0,
  })
);

// === Views ===
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public/views") });
});

app.get("/home", (req, res) => {
  res.sendFile("home.html", { root: path.join(__dirname, "public/views") });
});

// === API ===
app.use("/api/midias", midiasRouter);

export default app;
