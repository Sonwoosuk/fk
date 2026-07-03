import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { firebaseDb, isFirebaseConfigured } from '../lib/firebase'

const CartContext = createContext(null)

function toPriceNumber(price) {
  const normalized = String(price || '').replace(/[^\d]/g, '')
  return Number(normalized || 0)
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(Boolean(isFirebaseConfigured && user))
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gyeol-cart') || '[]')
    } catch {
      return []
    }
  })

  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const showToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
  }, [])

  const useFirestoreCart = Boolean(isFirebaseConfigured && firebaseDb && user)
  const cartPath = useFirestoreCart ? ['users', user.uid, 'cart'] : null

  useEffect(() => {
    if (!useFirestoreCart) {
      setLoading(false)
      try {
        setItems(JSON.parse(localStorage.getItem('gyeol-cart') || '[]'))
      } catch {
        setItems([])
      }
      return undefined
    }

    setLoading(true)
    const cartRef = collection(firebaseDb, ...cartPath)
    let unsubscribed = false

    try {
      const guestItems = JSON.parse(localStorage.getItem('gyeol-cart') || '[]')

      if (guestItems.length > 0) {
        const batch = writeBatch(firebaseDb)
        guestItems.forEach((item) => {
          batch.set(doc(cartRef, item.cartId), {
            ...item,
            updatedAt: serverTimestamp()
          }, { merge: true })
        })
        batch.commit().then(() => {
          localStorage.removeItem('gyeol-cart')
        }).catch(() => {
          localStorage.removeItem('gyeol-cart')
        })
      }
    } catch {
      localStorage.removeItem('gyeol-cart')
    }

    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      if (unsubscribed) return
      const nextItems = snapshot.docs
        .map((cartDoc) => cartDoc.data())
        .filter((item) => item.cartId)
        .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      setItems(nextItems)
      setLoading(false)
    }, () => {
      if (!unsubscribed) setLoading(false)
    })

    return () => {
      unsubscribed = true
      unsubscribe()
    }
  }, [useFirestoreCart, user?.uid])

  useEffect(() => {
    if (!useFirestoreCart) {
      localStorage.setItem('gyeol-cart', JSON.stringify(items))
    }
  }, [items, useFirestoreCart])

  const saveFirestoreItem = async (item) => {
    if (!useFirestoreCart) return
    await setDoc(doc(firebaseDb, ...cartPath, item.cartId), {
      ...item,
      updatedAt: serverTimestamp()
    }, { merge: true })
  }

  const addItem = async (product) => {
    showToast(`${product.name} 장바구니에 담았습니다`)

    if (useFirestoreCart) {
      const existing = items.find((item) => item.cartId === product.cartId)
      await saveFirestoreItem({
        ...existing,
        ...product,
        quantity: existing ? existing.quantity + 1 : 1
      })
      return
    }

    setItems((current) => {
      const existing = current.find((item) => item.cartId === product.cartId)

      if (existing) {
        return current.map((item) =>
          item.cartId === product.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })
  }

  const changeItemOptions = async (oldCartId, nextItem) => {
    const existing = items.find((item) => item.cartId === oldCartId)
    if (!existing) return

    const quantity = existing.quantity
    showToast('옵션을 변경했습니다')

    if (useFirestoreCart) {
      const target = items.find(
        (item) => item.cartId === nextItem.cartId && item.cartId !== oldCartId
      )

      if (nextItem.cartId !== oldCartId) {
        await deleteDoc(doc(firebaseDb, ...cartPath, oldCartId))
      }

      await saveFirestoreItem({
        ...existing,
        ...nextItem,
        quantity: target ? target.quantity + quantity : quantity
      })
      return
    }

    setItems((current) => {
      const rest = current.filter((item) => item.cartId !== oldCartId)
      const target = rest.find((item) => item.cartId === nextItem.cartId)

      if (target) {
        return rest.map((item) =>
          item.cartId === nextItem.cartId
            ? { ...item, ...nextItem, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...rest, { ...existing, ...nextItem, quantity }]
    })
  }

  const removeItem = async (cartId) => {
    if (useFirestoreCart) {
      await deleteDoc(doc(firebaseDb, ...cartPath, cartId))
      return
    }

    setItems((current) => current.filter((item) => item.cartId !== cartId))
  }

  const setQuantity = async (cartId, quantity) => {
    if (useFirestoreCart) {
      if (quantity <= 0) {
        await removeItem(cartId)
        return
      }

      const existing = items.find((item) => item.cartId === cartId)
      if (existing) {
        await saveFirestoreItem({ ...existing, quantity })
      }
      return
    }

    setItems((current) =>
      current
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = async () => {
    if (useFirestoreCart) {
      const batch = writeBatch(firebaseDb)
      items.forEach((item) => {
        batch.delete(doc(firebaseDb, ...cartPath, item.cartId))
      })
      await batch.commit()
      return
    }

    setItems([])
  }

  const summary = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + toPriceNumber(item.price) * item.quantity, 0)

    return { count, total }
  }, [items])

  const value = {
    items,
    addItem,
    changeItemOptions,
    removeItem,
    setQuantity,
    clearCart,
    loading,
    count: summary.count,
    total: summary.total
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="cart-toast" role="status">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
