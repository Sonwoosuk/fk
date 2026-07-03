import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import CircularText from './components/CircularText'
import Header from './components/Header'
import SideMenu from './components/SideMenu'
import Footer from './components/Footer'
import SearchBox from './components/SearchBox'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import MainPage from './pages/MainPage'
import WaterPage from './pages/WaterPage'
import EarthPage from './pages/EarthPage'
import ForestPage from './pages/ForestPage'
import LightPage from './pages/LightPage'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import SuccessPage from './pages/SuccessPage'
import './App.css'

function DesktopSidePanel({ pathname }) {
  const { items, count, total, removeItem } = useCart()
  const { user, login, googleLogin, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleDesktopLogin = async (event) => {
    event.preventDefault()
    setLoginError('')
    setSubmitting(true)

    try {
      await login(email, password)
      setEmail('')
      setPassword('')
    } catch (error) {
      setLoginError(error.message || '로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDesktopGoogleLogin = async () => {
    setLoginError('')
    setSubmitting(true)

    try {
      await googleLogin()
    } catch (error) {
      setLoginError(error.message || 'Google login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pathname === '/cart') {
    return (
      <div className="desktop-cart-box">
        <p className="desktop-panel-kicker">Cart</p>
        <h2 className="desktop-cart-title">Cart</h2>
        {items.length === 0 ? (
          <p className="desktop-cart-empty">장바구니가 비어있습니다.</p>
        ) : (
          <>
            <div className="desktop-cart-list">
              {items.map((item) => (
                <article className="desktop-cart-item" key={item.cartId}>
                  <div className="desktop-cart-thumb" style={{ backgroundImage: `url(${item.image})` }} />
                  <div>
                    <h3>{item.name}</h3>
                    {(item.selectedMetal || item.selectedSize) && (
                      <p className="desktop-cart-options">
                        {[item.selectedMetal, item.selectedSize && `Size ${item.selectedSize}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                    <p>{item.price} · {item.quantity}</p>
                    <button type="button" onClick={() => removeItem(item.cartId)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="desktop-cart-total">
              <span>Total</span>
              <strong>₩{total.toLocaleString('ko-KR')}</strong>
            </div>
          </>
        )}
        <div className="brush-line-center"></div>
      </div>
    )
  }

  return (
    <div className="login-box">
      <p className="desktop-panel-kicker">{user ? 'Account' : `Cart ${count}`}</p>
      <h2 className="login-title">{user ? 'Welcome' : 'Login'}</h2>
      {user ? (
        <div className="desktop-account">
          <p className="desktop-account-email">{user.email}</p>
          <nav className="desktop-account-links" aria-label="Account menu">
            <Link to="/mypage">My Page</Link>
            <Link to="/cart">Cart ({count})</Link>
          </nav>
          <button type="button" className="desktop-login-btn" onClick={logout}>Logout</button>
          <div className="brush-line-center"></div>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleDesktopLogin}>
          <div className="input-group">
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {loginError && <p className="desktop-login-error">{loginError}</p>}
          <button type="submit" className="desktop-login-btn" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
          <button
            type="button"
            className="desktop-google-btn"
            disabled={submitting}
            onClick={handleDesktopGoogleLogin}
          >
            Continue with Google
          </button>
          <Link to="/signup" className="desktop-text-link">Create Account</Link>
          <div className="brush-line-center"></div>
        </form>
      )}
    </div>
  )
}

function AppLayout() {
  const location = useLocation()
  const [sideOpen, setSideOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    '/images/collage/left-slide.jpg',
    '/images/collage/left-slide-2.jpg',
    '/images/collage/left-slide-3.jpg',
    '/images/collage/left-slide-4.jpg',
    '/images/collage/left-slide-5.jpg'
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const slideByPath = {
      '/': 0,
      '/brand': 0,
      '/water': 1,
      '/earth': 2,
      '/forest': 3,
      '/light': 4
    }

    setCurrentSlide(slideByPath[location.pathname] ?? 0)
  }, [location.pathname])

  const appBackgrounds = {
    '/': '/images/bg-waves.jpg',
    '/brand': '/images/bg-waves.jpg',
    '/water': '/images/water/water-page-bg.png',
    '/earth': '/images/earth/earth-page-bg.png',
    '/forest': '/images/forest/forest-page-bg.png',
    '/light': '/images/light/light-page-bg.png',
    '/login': '/images/bg-waves.jpg',
    '/signup': '/images/bg-waves.jpg',
    '/cart': '/images/bg-waves.jpg',
    '/success': '/images/bg-waves.jpg'
  }

  const appBackgroundImage = appBackgrounds[location.pathname] ?? '/images/bg-waves.jpg'
  const appBgOverlay = location.pathname === '/earth'
    ? 'rgba(88, 64, 39, 0.56)'
    : location.pathname === '/forest'
      ? 'rgba(12, 39, 22, 0.58)'
      : location.pathname === '/light'
        ? 'rgba(126, 92, 45, 0.38)'
        : 'rgba(18, 19, 19, 0.65)'

  return (
    <div
      className="app-container"
      style={{
        '--app-bg-image': `url("${appBackgroundImage}")`,
        '--app-bg-overlay': appBgOverlay
      }}
    >
      <aside className="sidebar-left">
        <div className="sidebar-left-content">
          <div className="left-search">
            <SearchBox />
          </div>

          <div className="left-carousel">
            <button className="carousel-btn prev-btn" aria-label="Previous image" onClick={prevSlide}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8" /></svg>
            </button>
            <div className="carousel-image-wrapper">
              {slides.map((slide, idx) => (
                <div
                  key={slide}
                  className={`carousel-image ${idx === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url("${slide}")` }}
                />
              ))}
            </div>
            <button className="carousel-btn next-btn" aria-label="Next image" onClick={nextSlide}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8" /></svg>
            </button>
          </div>

          <div className="left-brand-logo">
            <img
              src="/images/logo/logo.png"
              alt="GYEOL"
              className="left-brand-logo-img"
              onError={(event) => {
                event.target.style.display = 'none'
                const fallback = event.target.parentElement.querySelector('.left-brand-logo-fallback')
                if (fallback) fallback.style.display = 'block'
              }}
            />
            <div className="left-brand-logo-fallback" style={{ display: 'none' }}>
              <h2 className="brand-title">GYEOL</h2>
              <div className="brush-line"></div>
              <p className="brand-subtitle">Nature Inspired Jewelry</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="mobile-viewport">
        <div className="mobile-viewport-inner">
          <Header onMenuClick={() => setSideOpen(true)} />
          <SideMenu isOpen={sideOpen} onClose={() => setSideOpen(false)} />
          <div className="content-area">
            <div className="route-fade" key={location.pathname}>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/brand" element={<MainPage />} />
                <Route path="/water" element={<WaterPage />} />
                <Route path="/earth" element={<EarthPage />} />
                <Route path="/forest" element={<ForestPage />} />
                <Route path="/light" element={<LightPage />} />
                <Route path="/product/:collectionId/:productId" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/success" element={<SuccessPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      <aside className="sidebar-right">
        <div className="sidebar-right-content">
          <DesktopSidePanel pathname={location.pathname} />
          <div className="sidebar-circular-badge">
            <CircularText
              text="GYEOL · NATURE INSPIRED · "
              onHover="speedUp"
              spinDuration={24}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
