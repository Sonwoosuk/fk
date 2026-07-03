import { useState, useEffect } from 'react'
import './Footer.css'
import footerData from '../data/footer.json'
import mainData from '../data/main.json'
import BlurText from './BlurText'

export default function Footer() {
  const { contact, links, copyright } = footerData
  const { quote } = mainData
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      // 스크롤이 화면 높이의 절반(또는 400px) 이상 내려갔을 때 탑버튼 노출
      if (window.scrollY > window.innerHeight / 2) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <footer className="footer">
      {/* 1. Brand Logo Section (centered) */}
      <div className="footer-brand-section">
        <BlurText
          tag="p"
          text={quote}
          animateBy="words"
          direction="top"
          delay={120}
          stepDuration={0.5}
          threshold={0.2}
          rootMargin="-40px"
          className="footer-quote"
        />
        <div className="footer-brand">
          <img 
            src="/images/logo/logo.png" 
            alt="GYEOL" 
            className="footer-logo-img"
          />
        </div>
      </div>

      {/* 2. Divider line */}
      <div className="footer-divider"></div>

      {/* 3. Address, Links, Social columns */}
      <div className="footer-columns">
        <div className="footer-column footer-address-col">
          <h4 className="footer-col-title">{contact.address.label}</h4>
          <p className="footer-col-text">{contact.address.line1}</p>
          <p className="footer-col-text">{contact.address.line2}</p>
        </div>

        <div className="footer-column footer-links-col">
          {links.map(link => (
            <a key={link.label} href={link.path} className="footer-col-link">
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-column footer-social-col">
          <a href="#instagram" className="footer-social-btn" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#youtube" className="footer-social-btn" aria-label="YouTube">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#github" className="footer-social-btn" aria-label="GitHub">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>
      </div>

      {/* 4. Copyright centered */}
      <div className="footer-copyright-section">
        <p className="footer-copyright">{copyright}</p>
      </div>

      {/* Floating Scroll to Top Button */}
      <button 
        className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`} 
        onClick={scrollToTop} 
        aria-label="맨 위로 이동"
      >
        <span className="arrow-up">↑</span>
      </button>
    </footer>
  )
}
