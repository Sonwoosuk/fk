import waterData from '../data/water.json'
import earthData from '../data/earth.json'
import forestData from '../data/forest.json'
import lightData from '../data/light.json'

const collections = [
  {
    id: 'water',
    name: 'Water Collection',
    path: '/water',
    image: '/images/collections/thumbnails/collection-water.png',
    keywords: ['water', 'flow', 'wave', 'tide', 'sea', 'ocean', 'ring', '물', '바다', '파도', '반지']
  },
  {
    id: 'earth',
    name: 'Earth Collection',
    path: '/earth',
    image: '/images/collections/thumbnails/collection-earth.png',
    keywords: ['earth', 'stone', 'slate', 'cliff', 'terrain', 'necklace', '흙', '땅', '돌', '목걸이']
  },
  {
    id: 'forest',
    name: 'Forest Collection',
    path: '/forest',
    image: '/images/collections/thumbnails/collection-forest.png',
    keywords: ['forest', 'tree', 'moss', 'fern', 'branch', 'earrings', '숲', '나무', '귀걸이']
  },
  {
    id: 'light',
    name: 'Light Collection',
    path: '/light',
    image: '/images/collections/thumbnails/collection-light.png',
    keywords: ['light', 'halo', 'prism', 'ray', 'lumen', 'gleam', 'radiant', 'ring', '빛', '광채', '반지']
  }
]

const productGroups = {
  water: { label: 'Water', data: waterData },
  earth: { label: 'Earth', data: earthData },
  forest: { label: 'Forest', data: forestData },
  light: { label: 'Light', data: lightData }
}

export const searchItems = [
  ...collections.map((collection) => ({
    type: 'Collection',
    title: collection.name,
    subtitle: 'View collection',
    path: collection.path,
    image: collection.image,
    terms: [collection.id, collection.name, ...collection.keywords]
  })),
  ...Object.entries(productGroups).flatMap(([collectionId, group]) =>
    group.data.products.map((product) => ({
      type: 'Product',
      title: product.name,
      subtitle: `${group.label} Collection`,
      path: `/product/${collectionId}/${product.id}`,
      image: product.image,
      terms: [
        product.id,
        product.name,
        product.description,
        product.material,
        product.type,
        group.label,
        collectionId
      ]
    }))
  )
]

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function distance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  const current = Array.from({ length: b.length + 1 }, () => 0)

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    previous.splice(0, previous.length, ...current)
  }

  return previous[b.length]
}

function scoreItem(item, query) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return 0

  const words = item.terms
    .flatMap((term) => normalize(term).split(' '))
    .filter(Boolean)
  const haystack = words.join(' ')

  if (normalize(item.title) === normalizedQuery) return 120
  if (normalize(item.title).startsWith(normalizedQuery)) return 100
  if (words.some((word) => word.startsWith(normalizedQuery))) return 90
  if (haystack.includes(normalizedQuery)) return 70

  if (normalizedQuery.length >= 3) {
    const closest = words.some((word) => {
      if (Math.abs(word.length - normalizedQuery.length) > 2) return false
      return distance(word, normalizedQuery) <= (normalizedQuery.length > 5 ? 2 : 1)
    })
    if (closest) return 48
  }

  return 0
}

export function searchCatalog(query, limit = 7) {
  return searchItems
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item)
}
