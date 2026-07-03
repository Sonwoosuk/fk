import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CommercePages.css'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const checkoutId = searchParams.get('checkout_id')

  useEffect(() => {
    if (checkoutId) {
      clearCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId])

  return (
    <main className="commerce-page login-page-mobile">
      <section className="commerce-panel login-mobile-panel checkout-success-panel">
        <p className="commerce-kicker">Order</p>
        <h1>결제가 완료되었습니다</h1>
        <p className="checkout-success-desc">
          GYEOL을 찾아주셔서 감사합니다.<br />
          주문 내역은 입력하신 이메일로 발송됩니다.
        </p>
        {checkoutId && (
          <p className="checkout-success-id">주문 번호: {checkoutId}</p>
        )}
        <div className="checkout-success-actions">
          <Link to="/" className="commerce-primary-btn">메인으로</Link>
          <Link to="/water" className="commerce-text-link">쇼핑 계속하기</Link>
        </div>
      </section>
    </main>
  )
}
