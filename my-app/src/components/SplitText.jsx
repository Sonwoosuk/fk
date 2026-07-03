import { useEffect, useMemo, useRef, useState } from 'react'
import './SplitText.css'

function makeParts(text, splitType) {
  if (splitType.includes('words')) {
    return text.split(/(\s+)/).map((part, index) => ({
      id: `${part}-${index}`,
      text: part,
      isSpace: /^\s+$/.test(part),
      chars: splitType.includes('chars') ? Array.from(part) : null
    }))
  }

  if (splitType.includes('chars')) {
    return Array.from(text).map((part, index) => ({
      id: `${part}-${index}`,
      text: part,
      isSpace: /^\s$/.test(part),
      chars: null
    }))
  }

  return text.split(/(\n)/).map((part, index) => ({
    id: `${part}-${index}`,
    text: part,
    isSpace: part === '\n',
    chars: null
  }))
}

export default function SplitText({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) {
  const ref = useRef(null)
  const completedRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const parts = useMemo(() => makeParts(text, splitType), [text, splitType])
  const Tag = tag || 'p'
  const targetsCount = splitType.includes('words')
    ? parts.filter((part) => !part.isSpace).length
    : Array.from(text).filter((char) => !/^\s$/.test(char)).length

  useEffect(() => {
    const element = ref.current
    if (!element || completedRef.current) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        completedRef.current = true
        observer.unobserve(entry.target)
      }
    }, { threshold, rootMargin })

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  useEffect(() => {
    if (!visible || !onLetterAnimationComplete) return undefined

    const totalDuration = Math.max(0, targetsCount - 1) * delay + duration * 1000
    const timer = window.setTimeout(onLetterAnimationComplete, totalDuration)
    return () => window.clearTimeout(timer)
  }, [delay, duration, onLetterAnimationComplete, targetsCount, visible])

  const renderUnit = (part, index, nestedIndex = 0) => {
    if (part.isSpace) {
      return <span key={part.id} className="split-space"> </span>
    }

    return (
      <span
        key={part.id}
        className="split-unit"
        style={{
          '--split-index': index + nestedIndex,
          '--split-delay': `${delay}ms`,
          '--split-duration': `${duration}s`,
          '--split-from-opacity': from.opacity ?? 0,
          '--split-from-y': `${from.y ?? 40}px`,
          '--split-from-x': `${from.x ?? 0}px`,
          '--split-from-scale': from.scale ?? 1
        }}
      >
        {part.text}
      </span>
    )
  }

  let unitIndex = 0

  return (
    <Tag
      ref={ref}
      className={`split-parent ${visible ? 'split-parent--visible' : ''} ${className}`}
      style={{ textAlign }}
    >
      {splitType.includes('words') && splitType.includes('chars')
        ? parts.map((part) => {
            if (part.isSpace) return <span key={part.id} className="split-space"> </span>

            return (
              <span key={part.id} className="split-word">
                {part.chars.map((char, charIndex) => {
                  const currentIndex = unitIndex
                  unitIndex += 1
                  return renderUnit({
                    id: `${part.id}-${char}-${charIndex}`,
                    text: char,
                    isSpace: false
                  }, currentIndex)
                })}
              </span>
            )
          })
        : parts.map((part) => {
            if (part.isSpace) return <span key={part.id} className="split-space"> </span>
            const currentIndex = unitIndex
            unitIndex += 1
            return renderUnit(part, currentIndex)
          })}
    </Tag>
  )
}
