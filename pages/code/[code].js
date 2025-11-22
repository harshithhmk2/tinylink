export default function Stats({ data }) {
  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stats for {data.code}</h1>

      <div className="border p-4 rounded shadow">
        <p><strong>Short code:</strong> {data.code}</p>
        <p><strong>Target URL:</strong> {data.url}</p>
        <p><strong>Total clicks:</strong> {data.clicks}</p>
        <p><strong>Last clicked:</strong> {data.last_clicked ?? "Never"}</p>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${params.code}`);

  if (res.status === 404) return { notFound: true };

  const data = await res.json();
  return { props: { data } };
}
