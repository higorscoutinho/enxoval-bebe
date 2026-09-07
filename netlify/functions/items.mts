import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const db = getDatabase();

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const rows = await db.sql`SELECT * FROM items ORDER BY created_at ASC`;
    return Response.json(rows);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const [row] = await db.sql`
      INSERT INTO items (nome, categoria, tamanho, preciso, tenho, origem, notas)
      VALUES (${body.nome}, ${body.categoria}, ${body.tamanho}, ${body.preciso}, ${body.tenho}, ${body.origem}, ${body.notas || null})
      RETURNING *
    `;
    return Response.json(row);
  }

  if (req.method === "PUT") {
    const body = await req.json();
    const id = Number(body.id);
    const [row] = await db.sql`
      UPDATE items SET
        nome = ${body.nome},
        categoria = ${body.categoria},
        tamanho = ${body.tamanho},
        preciso = ${body.preciso},
        tenho = ${body.tenho},
        origem = ${body.origem},
        notas = ${body.notas || null}
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = Number(url.searchParams.get("id"));
    await db.sql`DELETE FROM items WHERE id = ${id}`;
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/items",
};
