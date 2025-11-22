import { useState, useEffect } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  async function loadLinks() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setFilteredLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLinks();
  }, []);

  // filtering
  useEffect(() => {
    const s = search.toLowerCase();
    const filtered = links.filter(
      (l) =>
        l.code.toLowerCase().includes(s) ||
        l.url.toLowerCase().includes(s)
    );
    setFilteredLinks(filtered);
  }, [search, links]);

  async function createLink(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined })
    });

    setCreating(false);

    if (res.status === 201) {
      setUrl("");
      setCode("");
      setSuccess("Link created successfully!");
      loadLinks();
    } else {
      const body = await res.json();
      setError(body.message || "Error creating link");
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  async function deleteLink(shortCode) {
    await fetch(`/api/links/${shortCode}`, { method: "DELETE" });
    loadLinks();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">TinyLink Dashboard</h1>

      {/* Search bar */}
      <input
        className="border p-2 w-full rounded"
        placeholder="Search by code or URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <form onSubmit={createLink} className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="border p-2 md:w-48 rounded"
            placeholder="Custom code (6–8 chars)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            disabled={creating}
            className={`px-4 py-2 rounded text-white ${
              creating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredLinks.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2">Clicks</th>
                <th className="p-2">Last Clicked</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((l) => (
                <tr key={l.code} className="border-t">
                  <td className="p-2">
                    <a
                      className="text-blue-600 hover:underline"
                      href={`/code/${l.code}`}
                    >
                      {l.code}
                    </a>
                  </td>

                  <td className="p-2 max-w-xs truncate">{l.url}</td>

                  <td className="p-2 text-center">{l.clicks}</td>

                  <td className="p-2 text-center">
                    {l.last_clicked
                      ? new Date(l.last_clicked).toLocaleString()
                      : "Never"}
                  </td>

                  <td className="p-2 space-x-3 flex flex-row">
                    <button
                      className="text-blue-600"
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/${l.code}`
                        )
                      }
                    >
                      Copy
                    </button>

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
        </div>
      )}
    </div>
  );
}
