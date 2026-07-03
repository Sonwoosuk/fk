import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import './FlowingMenu.css'

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#f4f1ed',
  bgColor = 'transparent',
  marqueeBgColor = '#f4f1ed',
  marqueeTextColor = '#121313',
  borderColor = 'rgba(244, 241, 237, 0.16)'
}) {
  return (
    <div className="flowing-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="flowing-menu">
        {items.map((item) => (
          <MenuItem
            key={item.text}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  )
}

function MenuItem({ link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor }) {
  const itemRef = useRef(null)
  const marqueeRef = useRef(null)
  const marqueeInnerRef = useRef(null)
  const animationRef = useRef(null)
  const armedRef = useRef(false)
  const armTimerRef = useRef(null)
  const [repetitions, setRepetitions] = useState(4)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2
    const yDiff = y - y2
    return xDiff * xDiff + yDiff * yDiff
  }

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return

      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-marquee__part')
      if (!marqueeContent) return

      const contentWidth = marqueeContent.offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [text, image])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return

      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-marquee__part')
      if (!marqueeContent) return

      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return

      if (animationRef.current) {
        animationRef.current.kill()
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      })
    }

    const timer = setTimeout(setupMarquee, 50)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [text, image, repetitions, speed])

  const playEnter = (edge) => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const playLeave = (edge) => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  const getEdge = (ev) => {
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    return findClosestEdge(x, y, rect.width, rect.height)
  }

  const handleMouseEnter = (ev) => {
    if (!itemRef.current) return
    playEnter(getEdge(ev))
  }

  const handleMouseLeave = (ev) => {
    if (!itemRef.current) return
    playLeave(getEdge(ev))
  }

  const disarm = () => {
    if (!armedRef.current) return
    armedRef.current = false
    playLeave('bottom')
  }

  // 터치 기기: 첫 탭은 애니메이션 미리보기, 두 번째 탭에 이동
  const handleClick = (ev) => {
    const isTouch = window.matchMedia('(hover: none)').matches
    if (!isTouch) return

    if (!armedRef.current) {
      ev.preventDefault()
      ev.stopPropagation()
      armedRef.current = true
      playEnter('top')
      clearTimeout(armTimerRef.current)
      armTimerRef.current = setTimeout(disarm, 2600)
    }
  }

  useEffect(() => () => clearTimeout(armTimerRef.current), [])

  return (
    <div className="flowing-menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="flowing-menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div className="flowing-marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="flowing-marquee__inner-wrap">
          <div className="flowing-marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="flowing-marquee__part" key={`${text}-${idx}`} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div className="flowing-marquee__img" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu
