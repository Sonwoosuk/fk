const POLAR_API_BASE = process.env.POLAR_SERVER === 'production'
  ? 'https://api.polar.sh'
  : 'https://sandbox-api.polar.sh'

export function getPolarToken() {
  return (process.env.POLAR_ACCESS_TOKEN || '').trim()
}

export async function polarFetch(path, options = {}) {
  const token = getPolarToken()

  if (!token) {
    throw new Error('POLAR_ACCESS_TOKEN is not configured')
  }

  const response = await fetch(`${POLAR_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = body?.detail || body?.error || response.statusText
    throw new Error(`Polar API ${response.status}: ${JSON.stringify(detail)}`)
  }

  return body
}

export async function listPolarProducts() {
  const data = await polarFetch('/v1/products/?is_archived=false&limit=100')

  return (data.items || []).map((product) => {
    const price = (product.prices || []).find((p) => !p.is_archived) || null

    return {
      id: product.id,
      name: product.name,
      priceAmount: price?.price_amount ?? null,
      priceCurrency: price?.price_currency ?? null
    }
  })
}
