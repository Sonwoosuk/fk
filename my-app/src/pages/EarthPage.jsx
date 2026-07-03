import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlurText from '../components/BlurText'
import CollectionHeroTop from '../components/CollectionHeroTop'
import ProductOptionsModal from '../components/ProductOptionsModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { buildCartItem, toPriceNumber } from '../lib/productOptions'
import mainData from '../data/main.json'
import earthData from '../data/earth.json'
import './EarthPage.css'

export default function EarthPage() {
  const { hero: mainHero } = mainData
  const { hero, collection, products, process } = earthData
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('necklaces')
  const productCategories = [
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' }
  ]

  const [optionProduct, setOptionProduct] = useState(null)

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/earth' } })
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
    <main className="earth-page">
      {optionProduct && (
        <ProductOptionsModal
          product={optionProduct}
          basePrice={toPriceNumber(optionProduct.price)}
          onClose={() => setOptionProduct(null)}
          onConfirm={({ metal, size }) => {
            addItem(buildCartItem(optionProduct, {
              collectionId: 'earth',
              collectionLabel: 'Earth',
              metal,
              size,
              basePrice: toPriceNumber(optionProduct.price)
            }))
            setOptionProduct(null)
          }}
        />
      )}
      <section className="earth-hero">
        <CollectionHeroTop poemLines={mainHero.poemLines} activeId="earth" />

        <div className="earth-hero-main reveal reveal-scale" style={{ transitionDelay: '0.4s' }}>
          <div className="earth-hero-image" style={{ backgroundImage: `url(${hero.image})` }}>
            <div className="earth-hero-overlay" />
            <div className="earth-title-block">
              <BlurText
                tag="h1"
                text={hero.title}
                animateBy="letters"
                direction="bottom"
                delay={85}
                stepDuration={0.52}
                className="earth-blur-title"
              />
              <div className="earth-title-line"></div>
              <BlurText
                tag="p"
                text={hero.subtitle}
                animateBy="words"
                direction="top"
                delay={90}
                stepDuration={0.42}
                className="earth-blur-subtitle"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="earth-collection-visual reveal reveal-up">
        <div className="earth-collection-main-image">
          <img src={collection.mainImage} alt={collection.title} />
        </div>
      </section>

      <section className="earth-collection-intro">
        <div className="earth-story-panel">
          <div className="earth-story-vertical reveal reveal-scale">
            <div className="earth-story-vertical-image" style={{ backgroundImage: `url(${collection.verticalImage})` }} />
          </div>

          <div className="earth-story-content">
            <img src="/images/logo/logo.png" alt="GYEOL" className="earth-story-logo reveal reveal-up" />
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
            <div className="earth-story-small reveal reveal-scale" style={{ transitionDelay: '0.18s' }}>
              <div className="earth-story-small-image" style={{ backgroundImage: `url(${collection.storyImage})` }} />
              <div className="earth-story-copy">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="earth-products">
        <BlurText
          tag="h2"
          text="Signature Pieces"
          animateBy="letters"
          direction="bottom"
          delay={28}
          stepDuration={0.48}
          threshold={0.18}
          rootMargin="-40px"
          className="earth-section-title"
        />

        <nav className="earth-product-tabs reveal reveal-up" aria-label="Earth product categories">
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

        {activeCategory === 'necklaces' ? (
          <div className="earth-product-grid">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="earth-product-card"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/earth/${product.id}`} className="product-detail-link">
                  <div className="earth-product-image" style={{ backgroundImage: `url(${product.image})` }} />
                </Link>
                <div className="earth-product-copy">
                  <h3>
                    <Link to={`/product/earth/${product.id}`} className="product-detail-link">
                      {product.name}
                    </Link>
                  </h3>
                  {product.description && <p>{product.description}</p>}
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

      <section className="earth-process">
        {process.map((item) => (
          <div
            key={item.id}
            className="earth-process-image reveal reveal-scale"
            style={{ backgroundImage: `url(${item.image})` }}
            role="img"
            aria-label={item.alt}
          />
        ))}
      </section>

    </main>
  )
}
