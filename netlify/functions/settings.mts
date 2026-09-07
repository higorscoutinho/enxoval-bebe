import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const db = getDatabase();

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    const rows = await db.sql`SELECT * FROM settings`;
    const settings: Record<string, string> = {};
    for (const r of rows as any[]) settings[r.key] = r.value;
    return Response.json(settings);
  }

  if (req.method === "PUT") {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      await db.sql`
        INSERT INTO settings (key, value) VALUES (${key}, ${String(value)})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/settings",
};
