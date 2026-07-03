import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import navData from '../data/navigation.json'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import SearchBox from './SearchBox'

export default function Header({ onMenuClick }) {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="header-menu-btn" onClick={onMenuClick}>
            MENU
          </button>
          <button
            type="button"
            className="header-search-btn"
            aria-label="검색"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {user && (
            <Link to="/mypage" className="header-action-btn">MY</Link>
          )}
        </div>

        <Link to="/" className="header-logo" aria-label="Go to home">
          <img 
            src="/images/logo/logo.png" 
            alt="GYEOL" 
            className="header-logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.logo-text-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="logo-text-fallback" style={{ display: 'none' }}>
            {navData.logo.text}
          </span>
        </Link>

        <div className="header-right">
          {user ? (
            <button type="button" className="header-action-btn" onClick={logout}>Logout</button>
          ) : (
            <Link to="/login" className="header-action-btn">Login</Link>
          )}
          <Link to="/cart" className="header-action-btn">CART{count > 0 ? ` ${count}` : ''}</Link>
        </div>
      </header>

      {searchOpen && (
        <div className="mobile-search-panel">
          <SearchBox
            variant="mobile"
            autoFocus
            onNavigate={() => setSearchOpen(false)}
          />
          <button
            type="button"
            className="mobile-search-close"
            aria-label="검색 닫기"
            onClick={() => setSearchOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  )
}
