import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { metalOptions, toPriceNumber, formatWon } from '../lib/productOptions'
import waterData from '../data/water.json'
import earthData from '../data/earth.json'
import forestData from '../data/forest.json'
import lightData from '../data/light.json'
import './ProductDetailPage.css'

const collections = {
  water: { label: 'Water', path: '/water', products: waterData.products },
  earth: { label: 'Earth', path: '/earth', products: earthData.products },
  forest: { label: 'Forest', path: '/forest', products: forestData.products },
  light: { label: 'Light', path: '/light', products: lightData.products }
}

export default function ProductDetailPage() {
  const { collectionId, productId } = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [openSection, setOpenSection] = useState(null)

  const collection = collections[collectionId]
  const product = collection?.products.find((item) => item.id === productId)
  const sizeOptions = product?.size ? product.size.split(/[·\s]+/).filter(Boolean) : []

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? null)
  const [selectedMetal, setSelectedMetal] = useState(
    metalOptions.find((metal) => metal.id === 'silver')
  )

  if (!collection || !product) {
    return (
      <main className="commerce-page product-detail-page">
        <div className="product-detail-missing">
          <p>상품을 찾을 수 없습니다.</p>
          <Link to="/" className="commerce-primary-link">메인으로</Link>
        </div>
      </main>
    )
  }

  const finalPrice = formatWon(toPriceNumber(product.price) + selectedMetal.surcharge)

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${collectionId}/${productId}` } })
      return
    }

    const optionKey = [selectedMetal.id, selectedSize].filter(Boolean).join('-')

    addItem({
      ...product,
      cartId: `${collectionId}-${product.id}-${optionKey}`,
      collection: collection.label,
      price: finalPrice,
      material: selectedMetal.label,
      selectedMetal: selectedMetal.label,
      selectedSize
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <main className="commerce-page product-detail-page">
      <nav className="product-detail-breadcrumb" aria-label="Breadcrumb">
        <Link to={collection.path}>{collection.label} Collection</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <div
        className="product-detail-image"
        style={{ backgroundImage: `url(${product.image})` }}
        role="img"
        aria-label={product.name}
      />

      <div className="product-detail-info">
        <p className="product-detail-kicker">{collection.label} Collection</p>
        <h1>{product.name}</h1>
        {product.description && <p className="product-detail-desc">{product.description}</p>}

        <div className="product-detail-accordion">
          <div className={`accordion-section ${openSection === 'metal' ? 'open' : ''}`}>
            <button
              type="button"
              className="accordion-header"
              aria-expanded={openSection === 'metal'}
              onClick={() => setOpenSection(openSection === 'metal' ? null : 'metal')}
            >
              <span className="accordion-label">Metal</span>
              <span className="accordion-value">{selectedMetal.label}</span>
              <span className="accordion-chevron" aria-hidden="true">⌄</span>
            </button>
            <div className="accordion-panel">
              <div className="accordion-panel-inner">
              {metalOptions.map((metal) => (
                <button
                  key={metal.id}
                  type="button"
                  className={`accordion-option ${selectedMetal.id === metal.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMetal(metal)
                    setOpenSection(null)
                  }}
                >
                  <span>{metal.label}</span>
                  <span className="option-surcharge">
                    {metal.surcharge === 0
                      ? '기본가'
                      : `${metal.surcharge > 0 ? '+' : '−'}${formatWon(Math.abs(metal.surcharge))}`}
                  </span>
                </button>
              ))}
              </div>
            </div>
          </div>

          {sizeOptions.length > 0 && (
            <div className={`accordion-section ${openSection === 'size' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-header"
                aria-expanded={openSection === 'size'}
                onClick={() => setOpenSection(openSection === 'size' ? null : 'size')}
              >
                <span className="accordion-label">Size</span>
                <span className="accordion-value">{selectedSize}</span>
                <span className="accordion-chevron" aria-hidden="true">⌄</span>
              </button>
              <div className="accordion-panel">
                <div className="accordion-panel-inner">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`accordion-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSize(size)
                      setOpenSection(null)
                    }}
                  >
                    <span>{size}</span>
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <dl className="product-detail-specs">
          <div>
            <dt>Price</dt>
            <dd>{finalPrice}</dd>
          </div>
          {product.type && (
            <div>
              <dt>Type</dt>
              <dd>{product.type}</dd>
            </div>
          )}
        </dl>

        <button type="button" className="product-detail-cart-btn" onClick={handleAddToCart}>
          {added ? '카트에 담았습니다' : '카트 담기'}
        </button>

        <Link to={collection.path} className="product-detail-back">
          ← {collection.label} Collection으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
