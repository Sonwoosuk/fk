export async function fetchPolarProducts() {
  const response = await fetch('/api/products')
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || '상품 정보를 불러오지 못했습니다.')
  }

  return data.products
}

export async function startCheckout(productNames) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productNames })
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || '결제 페이지 생성에 실패했습니다.')
  }

  window.location.assign(data.url)
}
