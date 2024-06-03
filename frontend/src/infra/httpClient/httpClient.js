// Arquitetura hexagonal
// Ports e Adapters

export async function httpClient(fetchURL, fetchOptions) {
  return fetch(fetchURL, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  })
    .then(async (res) => {
      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        body: await res.json(),
      }
    });
}
