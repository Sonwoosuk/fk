import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlurText from '../components/BlurText'
import CollectionHeroTop from '../components/CollectionHeroTop'
import ProductOptionsModal from '../components/ProductOptionsModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { buildCartItem, toPriceNumber } from '../lib/productOptions'
import { useTouchHover } from '../lib/useTouchHover'
import mainData from '../data/main.json'
import waterData from '../data/water.json'
import './WaterPage.css'

export default function WaterPage() {
  const { hero } = mainData
  const { collection, products, process } = waterData
  const { addItem } = useCart()
  const { guardTap } = useTouchHover()
  const { user } = useAuth()
  const navigate = useNavigate()
  const waterHeroImage = '/images/water/water-hero.png'
  const [activeCategory, setActiveCategory] = useState('rings')
  const productCategories = [
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' }
  ]

  const [optionProduct, setOptionProduct] = useState(null)

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/water' } })
      return
    }

    setOptionProduct(product)
  }

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => observer.observe(el))

    return () => {
      revealElements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return (
    <main className="water-page">
      {optionProduct && (
        <ProductOptionsModal
          product={optionProduct}
          basePrice={toPriceNumber(optionProduct.price)}
          onClose={() => setOptionProduct(null)}
          onConfirm={({ metal, size }) => {
            addItem(buildCartItem(optionProduct, {
              collectionId: 'water',
              collectionLabel: 'Water',
              metal,
              size,
              basePrice: toPriceNumber(optionProduct.price)
            }))
            setOptionProduct(null)
          }}
        />
      )}
      <section className="water-hero">
        <CollectionHeroTop poemLines={hero.poemLines} activeId="water" />

        <div className="water-hero-main reveal reveal-scale" style={{ transitionDelay: '0.4s' }}>
          <div
            className="water-hero-image"
            style={{ backgroundImage: `url(${waterHeroImage})` }}
          >
            <div className="water-hero-overlay" />
            <div className="water-title-block">
              <BlurText
                tag="h1"
                text="Water"
                animateBy="letters"
                direction="bottom"
                delay={85}
                stepDuration={0.52}
                className="water-blur-title"
              />
              <div className="water-title-line"></div>
              <BlurText
                tag="p"
                text="Where Water Meets Form"
                animateBy="words"
                direction="top"
                delay={90}
                stepDuration={0.42}
                className="water-blur-subtitle"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="water-collection-visual reveal reveal-up">
        <div className="water-collection-main-image">
          <img src={collection.mainImage} alt={collection.title} />
          <BlurText
            tag="h2"
            text={collection.title}
            animateBy="words"
            direction="bottom"
            delay={120}
            stepDuration={0.48}
            threshold={0.22}
            rootMargin="-60px"
          />
        </div>
      </section>

      <section className="water-collection-intro">
        <div className="water-story-panel">
          <div className="water-story-copy reveal reveal-up">
            {collection.bodyLines.map((line) => (
              <BlurText
                key={line}
                tag="p"
                text={line}
                animateBy="words"
                direction="top"
                delay={80}
                stepDuration={0.42}
                threshold={0.2}
                rootMargin="-40px"
              />
            ))}
            <img src="/images/logo/logo.png" alt="GYEOL" className="water-story-logo" />
          </div>

          <div className="water-story-image-wrap reveal reveal-scale" style={{ transitionDelay: '0.15s' }}>
            <div
              className="water-story-image"
              style={{ backgroundImage: `url(${collection.storyImage})` }}
            />
          </div>
        </div>
      </section>

      <section className="water-products">
        <BlurText
          tag="h2"
          text="Signature Pieces"
          animateBy="letters"
          direction="bottom"
          delay={28}
          stepDuration={0.48}
          threshold={0.18}
          rootMargin="-40px"
          className="water-section-title"
        />

        <nav className="water-product-tabs reveal reveal-up" aria-label="Water product categories">
          {productCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={activeCategory === category.id ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActiveCategory(category.id)
              }}
            >
              {category.label}
            </a>
          ))}
        </nav>

        {activeCategory === 'rings' ? (
          <div className="water-product-grid">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="water-product-card"
                onClickCapture={(event) => {
                  // 모바일: 첫 탭은 카드 포커스 효과만, 두 번째 탭에 상세로 이동 (카트 버튼은 예외)
                  if (event.target.closest('a')) guardTap(product.id)(event)
                }}
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/water/${product.id}`} className="product-detail-link">
                  <div
                    className="water-product-image"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </Link>
                <div className="water-product-copy">
                  <h3>
                    <Link to={`/product/water/${product.id}`} className="product-detail-link">
                      {product.name}
                    </Link>
                  </h3>
                  <p>{product.description}</p>
                  <dl>
                    <div>
                      <dt>Price</dt>
                      <dd>{product.price}</dd>
                    </div>
                    <div>
                      <dt>Material</dt>
                      <dd>{product.material}</dd>
                    </div>
                    <div>
                      <dt>Size</dt>
                      <dd>{product.size}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className="product-cart-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    카트 담기
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="product-coming-soon" role="status">
            상품 준비중입니다
          </div>
        )}
      </section>

      <section className="water-process">
        {process.map((item, index) => (
          <div
            key={item.id}
            className="water-process-image reveal reveal-scale"
            style={{
              backgroundImage: `url(${item.image})`,
              transitionDelay: `${index * 0.08}s`
            }}
            role="img"
            aria-label={item.alt}
          />
        ))}
      </section>

    </main>
  )
}
