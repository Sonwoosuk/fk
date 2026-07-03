import { listPolarProducts } from './_polar.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const products = await listPolarProducts()
    return res.status(200).json({ products })
  } catch (error) {
    console.error('[api/products]', error)
    return res.status(500).json({ error: error.message })
  }
}
