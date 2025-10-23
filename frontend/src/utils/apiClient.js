const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

export async function apiGet(path, { signal } = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
    signal,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || `Request failed with ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') {
    // If it's already a full URL (http/https), return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    // If it's an API path, return as-is (already includes /api/images/:id)
    if (image.startsWith('/api/')) {
      return `${BASE_URL}${image}`
    }
    // Otherwise assume it's a fileId
    return `${BASE_URL}/api/images/${image}`
  }
  if (image.fileId && !image.url) return `${BASE_URL}/api/images/${image.fileId}`
  if (image.url) {
    if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
      return image.url
    }
    return `${BASE_URL}${image.url}`
  }
  return ''
}
