export async function getJson<T>(
  url: string,
  failureMessage: string,
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const fallback =
      response.status === 404
        ? "The requested record was not found."
        : `${failureMessage} (${response.status})`;

    throw new Error(problem?.title ?? problem?.error ?? fallback);
  }

  return response.json() as Promise<T>;
}
