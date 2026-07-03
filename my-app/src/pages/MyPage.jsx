import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './CommercePages.css'

function formatWon(value) {
  return `₩${value.toLocaleString('ko-KR')}`
}

export default function MyPage() {
  const { user, logout } = useAuth()
  const { items, total } = useCart()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="commerce-page mypage-page">
      <section className="commerce-panel">
        <p className="commerce-kicker">Account</p>
        <h1>My Page</h1>

        <div className="mypage-account">
          <p className="mypage-account-label">Email</p>
          <p className="mypage-account-email">{user.email}</p>
          <button type="button" className="commerce-text-btn" onClick={logout}>Logout</button>
        </div>

        <div className="mypage-section">
          <div className="mypage-section-head">
            <h2>Cart Summary</h2>
            <Link to="/cart" className="commerce-text-link">View Cart</Link>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <p>장바구니가 비어있습니다.</p>
              <Link to="/water" className="commerce-primary-link">Shop Collection</Link>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.cartId}>
                    <div className="cart-item-image" style={{ backgroundImage: `url(${item.image})` }} />
                    <div className="cart-item-info">
                      <p className="cart-item-collection">{item.collection}</p>
                      <h2>{item.name}</h2>
                      <p className="cart-item-price">{item.price} · {item.quantity}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-summary">
                <div>
                  <span>Total</span>
                  <strong>{formatWon(total)}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
