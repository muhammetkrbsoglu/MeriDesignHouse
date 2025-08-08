const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${base.replace(/\/$/, '')}/api`;
};

export const apiClient = async (endpoint, options = {}) => {
  const { headers, ...rest } = options;
  const url = `${getApiUrl()}${endpoint}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API call failed: ${res.status} ${text}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
};


