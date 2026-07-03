import { useEffect, useMemo, useRef, useState } from 'react'
import './BlurText.css'

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
  stepDuration = 0.35,
  tag = 'p'
}) {
  const ref = useRef(null)
  const completedRef = useRef(false)
  const [inView, setInView] = useState(false)
  const Tag = tag || 'p'
  const elements = useMemo(() => {
    if (animateBy === 'letters') return Array.from(text)
    return text.split(/(\s+)/).filter((segment) => segment.length > 0)
  }, [animateBy, text])

  useEffect(() => {
    const element = ref.current
    if (!element || completedRef.current) return undefined

    const show = () => {
      if (completedRef.current) return
      setInView(true)
      completedRef.current = true
    }

    let frame = 0
    const checkVisibility = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const rect = element.getBoundingClientRect()
        const viewHeight = window.innerHeight || document.documentElement.clientHeight
        const triggerTop = viewHeight * (1 - threshold)
        const triggerBottom = viewHeight * threshold

        if (rect.top <= triggerTop && rect.bottom >= triggerBottom) {
          show()
        }
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        show()
        observer.unobserve(entry.target)
      }
    }, { threshold, rootMargin })

    observer.observe(element)
    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold, rootMargin])

  useEffect(() => {
    if (!inView || !onAnimationComplete) return undefined

    const timer = window.setTimeout(
      onAnimationComplete,
      Math.max(0, elements.length - 1) * delay + stepDuration * 1000
    )
    return () => window.clearTimeout(timer)
  }, [delay, elements.length, inView, onAnimationComplete, stepDuration])

  return (
    <Tag
      ref={ref}
      className={`blur-text ${inView ? 'blur-text--visible' : ''} ${className}`}
      style={{
        '--blur-delay': `${delay}ms`,
        '--blur-duration': `${stepDuration}s`,
        '--blur-y': direction === 'top' ? '-36px' : '36px'
      }}
    >
      {elements.map((segment, index) => {
        const isSpace = /^\s+$/.test(segment)

        return (
          <span
            key={`${segment}-${index}`}
            className={isSpace ? 'blur-text-space' : 'blur-text-segment'}
            style={{ '--blur-index': index }}
          >
            {isSpace ? '\u00A0' : segment}
          </span>
        )
      })}
    </Tag>
  )
}
