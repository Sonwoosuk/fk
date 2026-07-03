import { useEffect, useRef, useState } from 'react'
import './CollectionHeroTop.css'
import navData from '../data/navigation.json'
import BlurText from './BlurText'

const pullVideos = [
  '/videos/pull-reveal-1.mp4',
  '/videos/pull-reveal-2.mp4',
  '/videos/pull-reveal-3.mp4',
  '/videos/pull-reveal-4.mp4'
]

const randomVideo = () => pullVideos[Math.floor(Math.random() * pullVideos.length)]

export default function CollectionHeroTop({ poemLines = [], activeId = 'brand' }) {
  const { mainNav } = navData
  const videoRef = useRef(null)
  const dragStartRef = useRef(0)
  const pullDistanceRef = useRef(0)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const autoCloseRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  // 처음부터 랜덤 영상을 골라 preload="auto"로 미리 받아둠 (모바일에서 즉시 재생)
  const [selectedVideo, setSelectedVideo] = useState(randomVideo)

  const maxPull = 218
  const panelHeight = isVideoOpen ? maxPull : pullDistance

  const playVideo = () => {
    if (!videoRef.current) return
    videoRef.current.muted = true
    videoRef.current.playsInline = true
    const playPromise = videoRef.current.play()
    if (playPromise) {
      playPromise.catch(() => {})
    }
  }

  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    pullDistanceRef.current = 0
    setIsVideoOpen(false)
    setPullDistance(0)
  }

  // 미리 받아둔 현재 영상을 처음부터 재생 (로딩 지연 없음)
  const playPreloadedVideo = () => {
    if (!videoRef.current) return
    try {
      videoRef.current.currentTime = 0
    } catch {
      videoRef.current.load()
    }
    playVideo()
  }

  const openVideo = () => {
    pullDistanceRef.current = maxPull
    setPullDistance(maxPull)
    setIsVideoOpen(true)
    clearTimeout(autoCloseRef.current)
    window.requestAnimationFrame(playPreloadedVideo)
    autoCloseRef.current = setTimeout(closeAndPrepareNext, 6000)
  }

  // 닫으면서 다음 영상을 랜덤으로 교체해 미리 받아둠
  const closeAndPrepareNext = () => {
    clearTimeout(autoCloseRef.current)
    closeVideo()
    setSelectedVideo(randomVideo())
  }

  const handlePointerDown = (event) => {
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartRef.current = event.clientY
    pullDistanceRef.current = isVideoOpen ? maxPull : 0
    playPreloadedVideo()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return

    const distance = Math.max(0, Math.min(maxPull, event.clientY - dragStartRef.current))

    if (Math.abs(event.clientY - dragStartRef.current) > 6) {
      hasMovedRef.current = true
    }

    pullDistanceRef.current = distance
    setIsVideoOpen(false)
    setPullDistance(distance)

    if (distance > 28) {
      playVideo()
    }
  }

  const handlePointerUp = (event) => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // 포인터 캡처가 이미 해제된 경우 무시
    }

    // 움직임 없는 짧은 탭: 열기/닫기 토글 (열리면 몇 초 뒤 자동 되감김)
    if (!hasMovedRef.current) {
      if (isVideoOpen) {
        closeAndPrepareNext()
      } else {
        openVideo()
      }
      return
    }

    // 드래그였다면 손을 떼는 순간 위로 되감기
    closeAndPrepareNext()
  }

  useEffect(() => {
    if (!isVideoOpen) return undefined

    const frame = window.requestAnimationFrame(playVideo)
    return () => window.cancelAnimationFrame(frame)
  }, [isVideoOpen, selectedVideo])

  useEffect(() => () => clearTimeout(autoCloseRef.current), [])

  return (
    <div
      className={`collection-hero-top ${isVideoOpen ? 'collection-hero-top--video-open' : ''} ${pullDistance > 0 ? 'collection-hero-top--pulling' : ''}`}
      style={{ '--pull-video-height': `${panelHeight}px` }}
    >
      <div className="pull-video-panel" aria-hidden={!isVideoOpen && pullDistance === 0}>
        <video
          ref={videoRef}
          className="pull-video"
          src={selectedVideo}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={isVideoOpen ? playVideo : undefined}
        />
      </div>

      <div className="hero-poem-row reveal reveal-up">
        <div className="hero-poem-container">
          <div className="brush-stroke-poem"></div>
          <div className="hero-poem">
            {poemLines.map((line, lineIndex) => (
              <BlurText
                key={`${line}-${lineIndex}`}
                tag="p"
                text={line}
                animateBy="words"
                direction="top"
                delay={80}
                stepDuration={0.42}
                className="poem-line"
              />
            ))}
          </div>
        </div>

        <div
          className="hero-scroll-indicator"
          role="button"
          tabIndex={0}
          aria-label="아래로 당겨 영상 보기"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="scroll-text">pull down</span>
          <div className="pull-arrow" aria-hidden="true">
            <span className="pull-arrow-line"></span>
            <span className="pull-arrow-head"></span>
          </div>
        </div>
      </div>

      <nav className="hero-subnav reveal reveal-up" style={{ transitionDelay: '0.2s' }}>
        {mainNav.map(item => (
          <a
            key={item.id}
            href={item.path}
            className={`hero-subnav-item ${item.id === activeId ? 'active' : ''}`}
          >
            {item.label}
            <div className="brush-stroke-active"></div>
          </a>
        ))}
      </nav>
    </div>
  )
}
