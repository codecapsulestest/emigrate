import express from "express";
import { Pool } from "pg";

const app = express();
app.use(express.json());

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5000";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false } });

(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS "user" (username TEXT PRIMARY KEY, password TEXT NOT NULL)`);
})();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await pool.query(`SELECT 1 FROM "user" WHERE username=$1`, [username]);
  if (exists.rows.length > 0) return res.status(409).json({ error: "User exists" });
  await pool.query(`INSERT INTO "user" (username, password) VALUES ($1, $2)`, [username, password]);
  res.cookie("user", username);
  res.json({ ok: true, username: username });
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query(`SELECT password FROM "user" WHERE username=$1`, [username]);
  if (result.rows.length === 0 || result.rows[0].password !== password)
    return res.status(401).json({ error: "Invalid credentials" });
  res.cookie("user", username);
  res.json({ ok: true, username: username });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
