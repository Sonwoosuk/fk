import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { firebaseAuth, googleProvider, isFirebaseConfigured } from '../lib/firebase'

const AuthContext = createContext(null)

function makeDemoUser(email) {
  return {
    uid: `demo-${email}`,
    email
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (isFirebaseConfigured) return null

    try {
      return JSON.parse(localStorage.getItem('gyeol-demo-user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setLoading(false)
      return undefined
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const login = async (email, password) => {
    if (isFirebaseConfigured && firebaseAuth) {
      return signInWithEmailAndPassword(firebaseAuth, email, password)
    }

    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.')
    }

    const demoUser = makeDemoUser(email)
    localStorage.setItem('gyeol-demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
    return { user: demoUser }
  }

  const signup = async (email, password) => {
    if (isFirebaseConfigured && firebaseAuth) {
      return createUserWithEmailAndPassword(firebaseAuth, email, password)
    }

    if (!email || password.length < 6) {
      throw new Error('비밀번호는 6자 이상으로 입력해주세요.')
    }

    const demoUser = makeDemoUser(email)
    localStorage.setItem('gyeol-demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
    return { user: demoUser }
  }

  const googleLogin = async () => {
    if (isFirebaseConfigured && firebaseAuth && googleProvider) {
      return signInWithPopup(firebaseAuth, googleProvider)
    }

    const demoUser = makeDemoUser('google-demo@gyeol.local')
    localStorage.setItem('gyeol-demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
    return { user: demoUser }
  }

  const logout = async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth)
      return
    }

    localStorage.removeItem('gyeol-demo-user')
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    isFirebaseConfigured
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
