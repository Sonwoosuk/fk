// 비싼 광물 순 정렬. 실버가 표시가격 기준(추가금 0), 골드는 현 시세 반영 최고가.
export const metalOptions = [
  { id: '18k-gold', label: '18K Gold', surcharge: 480000 },
  { id: 'platinum', label: 'Platinum', surcharge: 380000 },
  { id: 'silver', label: '925 Sterling Silver', surcharge: 0 },
  { id: 'bronze', label: 'Bronze', surcharge: -40000 }
]

export function toPriceNumber(price) {
  return Number(String(price || '').replace(/[^\d]/g, '') || 0)
}

export function formatWon(value) {
  return `₩${value.toLocaleString('ko-KR')}`
}

export function getSizeOptions(product) {
  return product?.size ? String(product.size).split(/[·\s]+/).filter(Boolean) : []
}

export function findMetalByLabel(label) {
  return metalOptions.find((metal) => metal.label === label) ?? null
}

export function buildCartItem(product, { collectionId, collectionLabel, metal, size, basePrice }) {
  const optionKey = [metal.id, size].filter(Boolean).join('-')

  return {
    ...product,
    cartId: `${collectionId}-${product.id}-${optionKey}`,
    collection: collectionLabel,
    price: formatWon(basePrice + metal.surcharge),
    material: metal.label,
    selectedMetal: metal.label,
    selectedSize: size ?? null
  }
}
