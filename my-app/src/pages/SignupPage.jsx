import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './CommercePages.css'

export default function SignupPage() {
  const { signup, googleLogin, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 서로 다릅니다.')
      return
    }

    try {
      await signup(email, password)
      navigate('/cart')
    } catch (nextError) {
      setError(nextError.message || '회원가입에 실패했습니다.')
    }
  }

  const handleGoogleSignup = async () => {
    setError('')

    try {
      await googleLogin()
      navigate('/cart')
    } catch (nextError) {
      setError(nextError.message || 'Google login failed.')
    }
  }

  return (
    <main className="commerce-page login-page-mobile">
      <section className="commerce-panel login-mobile-panel">
        <p className="commerce-kicker">Account</p>
        <h1>Sign Up</h1>
        {!isFirebaseConfigured && (
          <p className="auth-note">Firebase 설정 전이라 임시 회원가입으로 작동합니다.</p>
        )}
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
          </label>
          <label>
            <span>Confirm Password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="button" className="commerce-primary-btn" onClick={handleSubmit}>Create Account</button>
          <button type="button" className="commerce-google-btn" onClick={handleGoogleSignup}>
            Continue with Google
          </button>
          <Link to="/login" className="commerce-text-link">Back to Login</Link>
        </div>
      </section>
    </main>
  )
}
