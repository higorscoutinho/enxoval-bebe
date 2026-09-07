import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const db = getDatabase();

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    const rows = await db.sql`SELECT * FROM categories ORDER BY label ASC`;
    return Response.json(rows);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const id = "cat_" + Date.now();
    const [row] = await db.sql`
      INSERT INTO categories (id, label, icon)
      VALUES (${id}, ${body.label}, ${body.icon})
      RETURNING *
    `;
    return Response.json(row);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/categories",
};
