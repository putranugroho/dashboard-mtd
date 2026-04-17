const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
};

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Request failed");
  }

  if (json?.code && json.code !== "000") {
    throw new Error(json?.message || "Request failed");
  }

  return json as T;
}