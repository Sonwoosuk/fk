import { Link } from 'react-router-dom'
import './SideMenu.css'
import FlowingMenu from './FlowingMenu'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import footerData from '../data/footer.json'

export default function SideMenu({ isOpen, onClose }) {
  const { brand, contact, links, copyright } = footerData
  const { user } = useAuth()
  const { count } = useCart()
  const flowingMenuItems = [
    { link: '/brand', text: 'Brand', image: '/images/hero/hero-main.jpg' },
    { link: '/water', text: 'Water', image: '/images/water/water-page-bg.png' },
    { link: '/earth', text: 'Earth', image: '/images/collections/backgrounds/earth-bg.png' },
    { link: '/forest', text: 'Forest', image: '/images/forest/forest-page-bg.png' },
    { link: '/light', text: 'Light', image: '/images/light/light-page-bg.png' }
  ]

  return (
    <>
      <div className={`side-overlay ${isOpen ? 'side-overlay--visible' : ''}`} onClick={onClose} />
      <nav className={`side-menu ${isOpen ? 'side-menu--open' : ''}`}>
        <div className="side-menu-main">
          {/* Logo Brand area */}
          <div className="side-menu-logo-container">
            <img 
              src="/images/logo/logo.png" 
              alt="GYEOL" 
              className="side-menu-logo-img"
            />
          </div>

          <div className="side-menu-flowing" onClick={onClose}>
            <FlowingMenu
              items={flowingMenuItems}
              speed={18}
              textColor="#121313"
              bgColor="transparent"
              marqueeBgColor="#ffffff"
              marqueeTextColor="#121313"
              borderColor="#e8e5e1"
            />
          </div>

          {/* Social Icons row */}
          <div className="side-menu-social">
            <a href="#instagram" className="side-menu-social-btn" aria-label="Instagram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#youtube" className="side-menu-social-btn" aria-label="YouTube">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#github" className="side-menu-social-btn" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>

          {/* Mini footer inside sidebar */}
          <div className="side-menu-footer">
            <div className="side-menu-footer-columns">
              <div className="side-menu-address">
                <h5 className="side-menu-footer-title">{contact.address.label}</h5>
                <p>{contact.address.line1}</p>
                <p>{contact.address.line2}</p>
              </div>
              <div className="side-menu-footer-links">
                {links.map(link => (
                  <a key={link.label} href={link.path} onClick={onClose}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="side-menu-copyright">
              {copyright}
            </div>
          </div>
        </div>

        {/* Separate Tags on the right */}
        <Link
          to={user ? '/mypage' : '/login'}
          className="side-menu-tag side-menu-tag-login"
          onClick={onClose}
        >
          <span>{user ? 'My Page' : 'Log-in'}</span>
        </Link>
        <Link to="/cart" className="side-menu-tag side-menu-tag-cart" onClick={onClose}>
          <span>Cart{count > 0 ? ` (${count})` : ''}</span>
        </Link>
      </nav>
    </>
  )
}
