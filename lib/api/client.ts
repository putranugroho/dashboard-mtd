export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
};

export const buildApiUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
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

export async function postFormData<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    body: formData,
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