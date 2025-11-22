const db = require("../lib/db");

export async function getServerSideProps({ params, res }) {
  const code = params.code;

  const { rows } = await db.query(
    `UPDATE links 
     SET clicks = clicks + 1, last_clicked = now()
     WHERE code = $1
     RETURNING url`,
    [code]
  );

  if (!rows.length) {
    return { notFound: true };
  }

  res.writeHead(302, { Location: rows[0].url });
  res.end();

  return { props: {} };
}

export default function RedirectPage() {
  return null;
}
