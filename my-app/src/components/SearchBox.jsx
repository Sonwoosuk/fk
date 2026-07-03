import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCatalog } from '../lib/searchIndex'
import './SearchBox.css'

export default function SearchBox({ variant = 'desktop', autoFocus = false, onNavigate }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const blurTimer = useRef(null)
  const results = useMemo(() => searchCatalog(query), [query])
  const showResults = open && query.trim().length > 0

  const goTo = (path) => {
    setQuery('')
    setOpen(false)
    navigate(path)
    onNavigate?.()
  }

  const submitFirstResult = (event) => {
    event.preventDefault()
    if (results[0]) goTo(results[0].path)
  }

  return (
    <div className={`search-box search-box--${variant}`}>
      <form className="search-box-form" onSubmit={submitFirstResult}>
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current)
            setOpen(true)
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 140)
          }}
        />
        <button type="submit" aria-label="Search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {showResults && (
        <div className="search-results" role="listbox" aria-label="Search results">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.path}
                type="button"
                className="search-result"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => goTo(result.path)}
              >
                <span className="search-result-thumb" style={{ backgroundImage: `url("${result.image}")` }} />
                <span className="search-result-copy">
                  <span className="search-result-title">{result.title}</span>
                  <span className="search-result-subtitle">{result.subtitle}</span>
                </span>
                <span className="search-result-type">{result.type}</span>
              </button>
            ))
          ) : (
            <p className="search-empty">No matching items</p>
          )}
        </div>
      )}
    </div>
  )
}
