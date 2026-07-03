import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CollectionHeroTop from '../components/CollectionHeroTop'
import BlurText from '../components/BlurText'
import ProductOptionsModal from '../components/ProductOptionsModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { buildCartItem, toPriceNumber } from '../lib/productOptions'
import { useTouchHover } from '../lib/useTouchHover'
import mainData from '../data/main.json'
import lightData from '../data/light.json'
import './LightPage.css'

export default function LightPage() {
  const { hero: mainHero } = mainData
  const { hero, collection, products, process } = lightData
  const { addItem } = useCart()
  const { guardTap } = useTouchHover()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('rings')
  const productCategories = [
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' }
  ]

  const [optionProduct, setOptionProduct] = useState(null)

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/light' } })
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
    <main className="light-page">
      {optionProduct && (
        <ProductOptionsModal
          product={optionProduct}
          basePrice={toPriceNumber(optionProduct.price)}
          onClose={() => setOptionProduct(null)}
          onConfirm={({ metal, size }) => {
            addItem(buildCartItem(optionProduct, {
              collectionId: 'light',
              collectionLabel: 'Light',
              metal,
              size,
              basePrice: toPriceNumber(optionProduct.price)
            }))
            setOptionProduct(null)
          }}
        />
      )}
      <section className="light-hero">
        <CollectionHeroTop poemLines={mainHero.poemLines} activeId="light" />

        <div className="light-hero-main reveal reveal-scale" style={{ transitionDelay: '0.4s' }}>
          <div className="light-hero-image" style={{ backgroundImage: `url(${hero.image})` }}>
            <div className="light-hero-overlay" />
            <div className="light-title-block">
              <BlurText
                tag="h1"
                text={hero.title}
                animateBy="letters"
                direction="bottom"
                delay={85}
                stepDuration={0.52}
                threshold={0.1}
                rootMargin="0px"
                className="light-blur-title"
              />
              <div className="light-title-line"></div>
              <BlurText
                tag="p"
                text={hero.subtitle}
                animateBy="words"
                direction="top"
                delay={90}
                stepDuration={0.42}
                threshold={0.1}
                rootMargin="0px"
                className="light-blur-subtitle"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="light-collection-intro">
        <div className="light-story-panel reveal reveal-up">
          <div className="light-story-image light-story-image-small" style={{ backgroundImage: `url(${collection.mainImage})` }} />
          <div className="light-story-image light-story-image-large" style={{ backgroundImage: `url(${collection.secondaryImage})` }} />
          <div className="light-story-copy">
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
            <div className="light-collection-copy">
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
          <img src="/images/logo/logo.png" alt="GYEOL" className="light-story-logo" />
        </div>
      </section>

      <section className="light-products">
        <BlurText
          tag="h2"
          text="Signature Pieces"
          animateBy="letters"
          direction="bottom"
          delay={28}
          stepDuration={0.48}
          threshold={0.18}
          rootMargin="-40px"
          className="light-section-title"
        />

        <nav className="light-product-tabs reveal reveal-up" aria-label="Light product categories">
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
          <div className="light-product-grid">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="light-product-card"
                onClickCapture={(event) => {
                  // 모바일: 첫 탭은 카드 포커스 효과만, 두 번째 탭에 상세로 이동 (카트 버튼은 예외)
                  if (event.target.closest('a')) guardTap(product.id)(event)
                }}
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/light/${product.id}`} className="product-detail-link">
                  <div className="light-product-image" style={{ backgroundImage: `url(${product.image})` }} />
                </Link>
                <div className="light-product-copy">
                  <h3>
                    <Link to={`/product/light/${product.id}`} className="product-detail-link">
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

      <section className="light-process">
        {process.map((item) => (
          <div
            key={item.id}
            className="light-process-image reveal reveal-scale"
            style={{ backgroundImage: `url(${item.image})` }}
            role="img"
            aria-label={item.alt}
          />
        ))}
      </section>

    </main>
  )
}
