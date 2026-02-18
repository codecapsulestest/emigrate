import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

const { rows } = await pool.query(`SELECT username FROM "user"`);
for (const row of rows) console.log(`Emailing ${row.username}`);
await pool.end();
