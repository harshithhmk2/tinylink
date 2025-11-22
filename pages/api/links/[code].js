const db = require("../../../lib/db");

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === "GET") {
    const { rows } = await db.query(
      "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code = $1",
      [code]
    );

    if (!rows.length) return res.status(404).json({ message: "not found" });
    return res.status(200).json(rows[0]);
  }

  if (req.method === "DELETE") {
    const { rowCount } = await db.query(
      "DELETE FROM links WHERE code = $1",
      [code]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "not found" });

    return res.status(204).end();
  }

  res.status(405).end();
}
