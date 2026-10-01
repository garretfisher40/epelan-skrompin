// src/utils/api.ts
/**
 * Safely parses response JSON without throwing `Unexpected end of JSON input`
 * or HTML doctype parse errors when running on static hosts like Netlify.
 */
export async function safeParseJson<T = any>(res: Response | null | undefined): Promise<T | null> {
  if (!res) return null;
  try {
    const contentType = res.headers?.get('content-type') || '';
    // If not JSON (e.g. Netlify 404 HTML or SPA fallback index.html), do not attempt to parse
    if (!contentType.includes('application/json')) {
      return null;
    }
    const text = await res.text();
    if (!text || !text.trim()) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
