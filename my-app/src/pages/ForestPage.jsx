import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlurText from '../components/BlurText'
import CollectionHeroTop from '../components/CollectionHeroTop'
import ProductOptionsModal from '../components/ProductOptionsModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { buildCartItem, toPriceNumber } from '../lib/productOptions'
import mainData from '../data/main.json'
import forestData from '../data/forest.json'
import './ForestPage.css'

export default function ForestPage() {
  const { hero: mainHero } = mainData
  const { hero, collection, products, process } = forestData
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('earrings')
  const productCategories = [
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' }
  ]

  const [optionProduct, setOptionProduct] = useState(null)

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/forest' } })
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
    <main className="forest-page">
      {optionProduct && (
        <ProductOptionsModal
          product={optionProduct}
          basePrice={toPriceNumber(optionProduct.price)}
          onClose={() => setOptionProduct(null)}
          onConfirm={({ metal, size }) => {
            addItem(buildCartItem(optionProduct, {
              collectionId: 'forest',
              collectionLabel: 'Forest',
              metal,
              size,
              basePrice: toPriceNumber(optionProduct.price)
            }))
            setOptionProduct(null)
          }}
        />
      )}
      <section className="forest-hero">
        <CollectionHeroTop poemLines={mainHero.poemLines} activeId="forest" />

        <div className="forest-hero-main reveal reveal-scale" style={{ transitionDelay: '0.4s' }}>
          <div className="forest-hero-image" style={{ backgroundImage: `url(${hero.image})` }}>
            <div className="forest-hero-overlay" />
            <div className="forest-title-block">
              <BlurText
                tag="h1"
                text={hero.title}
                animateBy="letters"
                direction="bottom"
                delay={85}
                stepDuration={0.52}
                className="forest-blur-title"
              />
              <div className="forest-title-line"></div>
              <BlurText
                tag="p"
                text={hero.subtitle}
                animateBy="words"
                direction="top"
                delay={90}
                stepDuration={0.42}
                className="forest-blur-subtitle"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="forest-collection-visual reveal reveal-up">
        <div className="forest-cross-image forest-cross-image-top">
          <img src={collection.mainImage} alt={collection.title} />
        </div>
        <div className="forest-cross-image forest-cross-image-bottom">
          <img src={collection.secondaryImage} alt="" />
        </div>
      </section>

      <section className="forest-collection-intro">
        <div className="forest-story-panel">
          <div className="forest-story-copy reveal reveal-up">
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
            <div className="forest-collection-copy">
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
          <img src="/images/logo/logo.png" alt="GYEOL" className="forest-story-logo reveal reveal-up" />
        </div>
      </section>

      <section className="forest-products">
        <BlurText
          tag="h2"
          text="Signature Pieces"
          animateBy="letters"
          direction="bottom"
          delay={28}
          stepDuration={0.48}
          threshold={0.18}
          rootMargin="-40px"
          className="forest-section-title"
        />

        <nav className="forest-product-tabs reveal reveal-up" aria-label="Forest product categories">
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

        {activeCategory === 'earrings' ? (
          <div className="forest-product-grid">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="forest-product-card"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/forest/${product.id}`} className="product-detail-link">
                  <div className="forest-product-image" style={{ backgroundImage: `url(${product.image})` }} />
                </Link>
                <div className="forest-product-copy">
                  <h3>
                    <Link to={`/product/forest/${product.id}`} className="product-detail-link">
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
                    {product.size && (
                      <div>
                        <dt>Size</dt>
                        <dd>{product.size}</dd>
                      </div>
                    )}
                    {product.type && (
                      <div>
                        <dt>Type</dt>
                        <dd>{product.type}</dd>
                      </div>
                    )}
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

      <section className="forest-process">
        {process.map((item) => (
          <div
            key={item.id}
            className="forest-process-image reveal reveal-scale"
            style={{ backgroundImage: `url(${item.image})` }}
            role="img"
            aria-label={item.alt}
          />
        ))}
      </section>

    </main>
  )
}
