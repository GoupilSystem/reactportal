export async function runLookup(payload: any) {
  const res = await fetch(
    "https://localhost:7064/api/lookup/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return await res.json();
}