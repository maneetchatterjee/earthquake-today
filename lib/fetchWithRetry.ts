export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      // Treat non-ok as an error to trigger retry
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }

    if (attempt < retries) {
      // Exponential backoff before next retry: 1s after attempt 0, 2s after attempt 1, 4s after attempt 2
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Fetch failed after retries');
}
