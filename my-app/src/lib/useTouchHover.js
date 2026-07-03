import { useEffect, useRef } from 'react'

const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

// 터치 기기에서 호버 효과를 볼 수 있도록:
// 첫 탭은 이동을 막고 호버 효과(.touch-hover)만 보여주고, 같은 요소를 다시 탭하면 실제로 이동한다.
// 데스크톱(마우스)에서는 아무 것도 하지 않는다.
// 주의: React state로 className을 바꾸면 IntersectionObserver가 붙여둔 .revealed 클래스가
// 리렌더 때 지워져 요소가 사라지므로, 반드시 DOM classList로만 조작한다.
export function useTouchHover(resetMs = 3500) {
  const timerRef = useRef(null)
  const activeElRef = useRef(null)

  const clearHover = () => {
    activeElRef.current?.classList.remove('touch-hover')
    activeElRef.current = null
  }

  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearHover()
  }, [])

  const guardTap = () => (event) => {
    if (!isTouchDevice()) return

    const target = event.currentTarget

    if (target.classList.contains('touch-hover')) return

    event.preventDefault()
    clearHover()
    target.classList.add('touch-hover')
    activeElRef.current = target
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(clearHover, resetMs)
  }

  return { guardTap }
}
