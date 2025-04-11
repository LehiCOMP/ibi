
import { defineConfig } from "drizzle-kit";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL é necessária");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "pg",
  dbCredentials: {
    connectionString: process.env.SUPABASE_URL
  }
});
