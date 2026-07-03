import { useEffect } from 'react'
import './MainPage.css'
import BlurText from '../components/BlurText'
import CollectionHeroTop from '../components/CollectionHeroTop'
import mainData from '../data/main.json'
import collectionsData from '../data/collections.json'
import { useTouchHover } from '../lib/useTouchHover'

export default function MainPage() {
  const { hero, collage, collageText, intro } = mainData
  const { collections } = collectionsData
  const { guardTap } = useTouchHover()

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px', // 스크롤 시 뷰포트 하단에서 약간 미리 반응하도록 설정
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target) // 한 번 나타난 후에는 중복 작동 방지
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
    <main className="main-page">

      {/* ===== HERO ===== */}
      <section className="hero">
        <CollectionHeroTop poemLines={hero.poemLines} activeId="brand" />

        {/* Hero Necklace Image Card */}
        <div className="hero-main-card reveal reveal-scale" style={{ transitionDelay: '0.4s' }}>
          <div 
            className="hero-card-image"
            style={{ backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : 'none' }}
          >
            <div className="hero-card-overlay" />
            <div className="hero-card-brand">
              <img 
                src="/images/logo/logo.png" 
                alt="GYEOL" 
                className="hero-card-brand-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLLAGE SECTION ===== */}
      <section className="collage-section">
        
        {/* Rings on Moss (Landscape) */}
        <div className="collage-moss reveal reveal-up">
          <div 
            className="collage-img"
            style={{ backgroundImage: collage[0] ? `url(${collage[0].image})` : 'none' }}
          />
        </div>

        {/* Ring Underwater & Text Row */}
        <div className="collage-row-split">
          <div className="collage-underwater reveal reveal-scale">
            <div 
              className="collage-img"
              style={{ backgroundImage: collage[1] ? `url(${collage[1].image})` : 'none' }}
            />
          </div>
          <BlurText
            tag="h3"
            text={collageText.heading}
            animateBy="words"
            direction="bottom"
            delay={110}
            stepDuration={0.48}
            threshold={0.18}
            rootMargin="-40px"
            className="collage-heading-serif"
          />
          <div className="collage-text-block reveal reveal-up" style={{ transitionDelay: '0.35s' }}>
            <div className="collage-body-lines">
              {mainData.collageText.bodyLines && mainData.collageText.bodyLines.map((line, i) => (
                <BlurText
                  key={i}
                  tag="p"
                  text={line}
                  animateBy="words"
                  direction="top"
                  delay={80}
                  stepDuration={0.42}
                  threshold={0.18}
                  rootMargin="-40px"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Earrings & Hand split */}
        <div className="collage-row-overlap">
          <div className="collage-earrings reveal reveal-scale">
            <div 
              className="collage-img"
              style={{ backgroundImage: collage[2] ? `url(${collage[2].image})` : 'none' }}
            />
            <div className="collage-subtext-lines reveal reveal-up" style={{ transitionDelay: '0.2s' }}>
              {mainData.collageSubText && mainData.collageSubText.map((line, i) => (
                <BlurText
                  key={i}
                  tag="p"
                  text={line}
                  animateBy="words"
                  direction="top"
                  delay={80}
                  stepDuration={0.42}
                  threshold={0.18}
                  rootMargin="-40px"
                />
              ))}
            </div>
          </div>
          <div className="collage-hand reveal reveal-scale">
            <div 
              className="collage-img"
              style={{ backgroundImage: collage[3] ? `url(${collage[3].image})` : 'none' }}
            />
          </div>
        </div>

        {/* GYEOL Logo at the bottom left */}
        <div className="collage-logo-bottom reveal reveal-up">
          <img 
            src="/images/logo/logo.png" 
            alt="GYEOL" 
            className="collage-logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.collage-logo-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="collage-logo-fallback" style={{ display: 'none' }}>GYEOL</span>
        </div>
      </section>

      {/* ===== INTRO SECTION ===== */}
      <section className="intro-section">
        <div className="intro-content reveal reveal-up">
          <h2 className="intro-heading">
            {intro.headingKo.split('\n').map((line, i) => {
              if (line.includes('결')) {
                const parts = line.split('결');
                return (
                  <span key={i}>
                    {parts[0]}
                    <span className="special-underline">결</span>
                    {parts[1]}
                    <br />
                  </span>
                );
              }
              return <span key={i}>{line}<br /></span>;
            })}
          </h2>
          {intro.bodyKo && (
            <div className="intro-body">
              {intro.bodyKo.split('\n').map((line, i) => (
                <BlurText
                  key={i}
                  tag="p"
                  text={line}
                  animateBy="words"
                  direction="top"
                  delay={80}
                  stepDuration={0.42}
                  threshold={0.18}
                  rootMargin="-40px"
                />
              ))}
            </div>
          )}
        </div>

        <div className="collection-thumbs">
          {collections.map((col, idx) => (
            <a 
              key={col.id} 
              href={`/${col.id}`} 
              className="collection-thumb reveal reveal-up"
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              <span className="collection-thumb-label">{col.name}</span>
              <div
                className="collection-thumb-img"
                style={{ backgroundImage: col.thumbnail ? `url(${col.thumbnail})` : 'none' }}
              />
            </a>
          ))}
        </div>
      </section>

      {/* ===== COLLECTION BANNERS ===== */}
      <section className="collection-banners">
        {collections.map((col, idx) => (
          <a
            key={col.id}
            href={`/${col.id}`}
            className="collection-banner reveal reveal-up"
            onClick={guardTap(col.id)}
            style={{
              transitionDelay: `${idx * 0.1}s`
            }}
          >
            {/* Default background image layer */}
            <div 
              className="collection-banner-bg default-bg"
              style={{ backgroundImage: col.background ? `url(${col.background})` : 'none' }}
            />
            {/* Hover background image layer */}
            <div 
              className="collection-banner-bg hover-bg"
              style={{ backgroundImage: col.backgroundHover ? `url(${col.backgroundHover})` : 'none' }}
            />
            <div className="collection-banner-overlay" />
            <div className="collection-banner-content">
              <BlurText
                tag="div"
                text={`${col.name} Collection`}
                animateBy="words"
                direction="bottom"
                delay={120}
                stepDuration={0.48}
                threshold={0.18}
                rootMargin="-40px"
                className="collection-banner-title"
              />
              <div className="collection-banner-arrow-line">
                <svg width="140" height="15" viewBox="0 0 140 15" fill="none">
                  <path d="M0 7.5H138M138 7.5L132 1.5M138 7.5L132 13.5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </section>

    </main>
  )
}
