const db = require("../../../lib/db");
const codeRegex = /^[A-Za-z0-9]{6,8}$/;

function validateUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { rows } = await db.query(
      "SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
    );
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { url, code } = req.body;

    if (!url) return res.status(400).json({ message: "url required" });
    if (!validateUrl(url)) return res.status(400).json({ message: "invalid url" });

    let shortCode = code;
    if (shortCode && !codeRegex.test(shortCode))
      return res.status(400).json({ message: "invalid code" });

    if (!shortCode) {
      shortCode = Math.random().toString(36).substring(2, 8);
    }

    try {
      await db.query(
        "INSERT INTO links (code, url) VALUES ($1, $2)",
        [shortCode, url]
      );
      return res.status(201).json({ code: shortCode, url });
    } catch (e) {
      if (e.code === "23505")
        return res.status(409).json({ message: "code already exists" });

      return res.status(500).json({ message: "server error" });
    }
  }

  res.status(405).end();
}
