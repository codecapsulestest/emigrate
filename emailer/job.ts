import cron from "node-cron";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

const schedule = process.env.CRON_SCHEDULE || "0 * * * *";

async function emailJob() {
  console.log(`Running email job at ${new Date().toISOString()}`);
  const { rows } = await pool.query(`SELECT username FROM "user"`);
  for (const row of rows) console.log(`Emailing ${row.username}`);
}

emailJob();
cron.schedule(schedule, emailJob);

console.log(`Email job scheduled: ${schedule}`);
