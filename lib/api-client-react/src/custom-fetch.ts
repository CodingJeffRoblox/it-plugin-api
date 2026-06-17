let baseUrl = '';

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
}

export async function customFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${baseUrl}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}
