import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductOptionsModal from '../components/ProductOptionsModal'
import { useCart } from '../context/CartContext'
import { buildCartItem, findMetalByLabel, formatWon, toPriceNumber } from '../lib/productOptions'
import './CommercePages.css'

export default function CartPage() {
  const { items, removeItem, setQuantity, clearCart, changeItemOptions, total, loading } = useCart()
  const [editingItem, setEditingItem] = useState(null)

  const editingMetal = editingItem ? findMetalByLabel(editingItem.selectedMetal) : null
  const editingBasePrice = editingItem
    ? toPriceNumber(editingItem.price) - (editingMetal?.surcharge ?? 0)
    : 0

  return (
    <main className="commerce-page cart-page">
      {editingItem && (
        <ProductOptionsModal
          product={editingItem}
          basePrice={editingBasePrice}
          initialMetalId={editingMetal?.id ?? null}
          initialSize={editingItem.selectedSize ?? null}
          title="옵션 변경"
          confirmLabel="변경하기"
          onClose={() => setEditingItem(null)}
          onConfirm={({ metal, size }) => {
            changeItemOptions(editingItem.cartId, buildCartItem(editingItem, {
              collectionId: String(editingItem.collection || '').toLowerCase(),
              collectionLabel: editingItem.collection,
              metal,
              size,
              basePrice: editingBasePrice
            }))
            setEditingItem(null)
          }}
        />
      )}

      <section className="commerce-panel">
        <p className="commerce-kicker">Cart</p>
        <h1>Shopping Bag</h1>

        {loading ? (
          <div className="cart-empty">
            <p>Loading cart...</p>
          </div>
        ) : items.length === 0 ? (
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
                    {(item.selectedMetal || item.selectedSize) && (
                      <p className="cart-item-options">
                        {[item.selectedMetal, item.selectedSize && `Size ${item.selectedSize}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                    <p className="cart-item-price">{item.price}</p>
                    <div className="cart-item-controls">
                      <button type="button" onClick={() => setQuantity(item.cartId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => setQuantity(item.cartId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-actions">
                      <button type="button" className="cart-edit-btn" onClick={() => setEditingItem(item)}>
                        옵션 변경
                      </button>
                      <button type="button" className="cart-remove-btn" onClick={() => removeItem(item.cartId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Total</span>
                <strong>{formatWon(total)}</strong>
              </div>
              <button type="button" className="commerce-primary-btn">Checkout</button>
              <button type="button" className="commerce-text-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
