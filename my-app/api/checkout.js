import { listPolarProducts, polarFetch } from './_polar.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { productNames } = req.body || {}
    const wanted = Array.isArray(productNames) ? productNames.filter(Boolean) : []

    if (wanted.length === 0) {
      return res.status(400).json({ error: '결제할 상품이 없습니다.' })
    }

    // 상품 목록은 Polar API에서 실시간 조회 후 이름으로 매칭
    const polarProducts = await listPolarProducts()
    const matched = polarProducts.filter((product) =>
      wanted.some((name) => name.trim().toLowerCase() === product.name.trim().toLowerCase())
    )

    if (matched.length === 0) {
      return res.status(400).json({
        error: '아직 결제가 지원되지 않는 상품입니다. (Polar에 등록된 상품: Tree Ring Earrings, Flow Ring, Stone Necklace)'
      })
    }

    const origin = req.headers.origin
      || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`

    const checkout = await polarFetch('/v1/checkouts/', {
      method: 'POST',
      body: JSON.stringify({
        products: matched.map((product) => product.id),
        success_url: `${origin}/success?checkout_id={CHECKOUT_ID}`
      })
    })

    return res.status(200).json({ url: checkout.url, id: checkout.id })
  } catch (error) {
    console.error('[api/checkout]', error)
    return res.status(500).json({ error: error.message })
  }
}
