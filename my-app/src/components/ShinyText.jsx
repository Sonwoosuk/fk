import './ShinyText.css'

export default function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}) {
  return (
    <span
      className={[
        'shiny-text',
        disabled ? 'shiny-text--disabled' : '',
        yoyo ? 'shiny-text--yoyo' : '',
        pauseOnHover ? 'shiny-text--pause-on-hover' : '',
        className
      ].filter(Boolean).join(' ')}
      style={{
        '--shiny-speed': `${speed}s`,
        '--shiny-delay': `${delay}s`,
        '--shiny-color': color,
        '--shiny-shine-color': shineColor,
        '--shiny-spread': `${spread}deg`,
        '--shiny-start': direction === 'right' ? '-50% center' : '150% center',
        '--shiny-end': direction === 'right' ? '150% center' : '-50% center'
      }}
    >
      {text}
    </span>
  )
}
