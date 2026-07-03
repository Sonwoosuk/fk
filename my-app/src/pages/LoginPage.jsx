import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './CommercePages.css'

export default function LoginPage() {
  const { login, googleLogin, user, logout, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = location.state?.from || '/mypage'

  const handleSubmit = async () => {
    setError('')

    try {
      await login(email, password)
      navigate(from)
    } catch (nextError) {
      setError(nextError.message || '로그인에 실패했습니다.')
    }
  }

  const handleGoogleLogin = async () => {
    setError('')

    if (window.location.hostname === '127.0.0.1') {
      const nextUrl = new URL(window.location.href)
      nextUrl.hostname = 'localhost'
      window.location.assign(nextUrl.toString())
      return
    }

    try {
      await googleLogin()
      navigate(from)
    } catch (nextError) {
      setError(nextError.message || 'Google login failed.')
    }
  }

  return (
    <main className="commerce-page login-page-mobile">
      <section className="commerce-panel login-mobile-panel">
        <p className="commerce-kicker">Account</p>
        <h1>Login</h1>
        {!isFirebaseConfigured && (
          <p className="auth-note">Firebase 설정 전이라 임시 로그인으로 작동합니다.</p>
        )}
        {user ? (
          <div className="auth-current">
            <p>{user.email} 로그인 중입니다.</p>
            <button type="button" className="commerce-primary-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="commerce-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="button" className="commerce-primary-btn" onClick={handleSubmit}>Login</button>
            <button type="button" className="commerce-google-btn" onClick={handleGoogleLogin}>
              Continue with Google
            </button>
            <Link to="/signup" className="commerce-text-link">Create Account</Link>
          </div>
        )}
      </section>
    </main>
  )
}
