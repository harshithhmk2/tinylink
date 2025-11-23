import { useState, useEffect } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function loadLinks() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function createLink(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined }),
    });

    if (res.status === 201) {
      setUrl("");
      setCode("");
      loadLinks();
    } else {
      const body = await res.json();
      setError(body.message || "Error creating link");
    }
  }

  async function deleteLink(shortCode) {
    await fetch(`/api/links/${shortCode}`, { method: "DELETE" });
    loadLinks();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

      <form onSubmit={createLink} className="mb-6">
        <div className="flex gap-3">
          <input
            className="border p-2 flex-1"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="border p-2 w-40"
            placeholder="Custom code (optional)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="border">
              <th className="p-2">Code</th>
              <th className="p-2">URL</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.code} className="border">
                <td className="p-2">
                  <a className="text-blue-600" href={`/code/${l.code}`}>
                    {l.code}
                  </a>
                </td>
                <td className="p-2 truncate">{l.url}</td>
                <td className="p-2">{l.clicks}</td>
                <td className="p-2">
                  <button
                    className="text-red-600"
                    onClick={() => deleteLink(l.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
