'use client'

import { useEffect, useRef } from 'react'
import { animated, useSpring } from '@react-spring/web'

export default function WaveBackground() {
  const containerRef = useRef(null)

  // Blob motion + hover scale + brightness
  const [{ x, y, scale, brightness }, blobApi] = useSpring(() => ({
    x: 300,
    y: 300,
    scale: 1,
    brightness: 1,
    config: { tension: 120, friction: 20 }
  }))

  // Idle color rotation
  const [{ hue }] = useSpring(() => ({
    from: { hue: 0 },
    to: { hue: 360 },
    loop: true,
    config: { duration: 12000 }
  }))

  // Ripple animation
  const [{ rippleScale, rippleOpacity }, rippleApi] = useSpring(() => ({
    rippleScale: 0.3,
    rippleOpacity: 0,
    config: { tension: 140, friction: 25 }
  }))

  // Cursor-follow movement (ONLY inside hero region)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) return

      blobApi.start({
        x: e.clientX - 200,
        y: e.clientY - 200,
      })
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [blobApi])

  // Hover reaction on interactive elements
  useEffect(() => {
    const elements = document.querySelectorAll('a, button, .hover-react')

    const handleEnter = () => {
      blobApi.start({ scale: 1.25, brightness: 1.6 })

      // Reset ripple instantly
      rippleApi.start({ rippleScale: 0.3, rippleOpacity: 0.4, immediate: true })

      requestAnimationFrame(() => {
        rippleApi.start({ rippleScale: 3.3, rippleOpacity: 0 })
      })
    }

    const handleLeave = () => {
      blobApi.start({ scale: 1, brightness: 1 })
    }

    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [blobApi, rippleApi])

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {/* Main blob */}
      <animated.div
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: x.to((xx) => `translate(${xx}px, ${y.get()}px) scale(${scale.get()})`),
          filter: brightness.to((b) => `blur(110px) brightness(${b})`),
          background: hue.to(
            (h) =>
              `radial-gradient(circle at 30% 30%,
              hsla(${h % 360}, 80%, 65%, 0.6),
              hsla(${(h + 120) % 360}, 80%, 55%, 0.35),
              transparent)`
          ),
        }}
      />

      {/* Ripple ring */}
      <animated.div
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.25)',
          pointerEvents: 'none',
          transform: rippleScale.to((s) => `translate(${x.get()}px, ${y.get()}px) scale(${s})`),
          opacity: rippleOpacity,
          filter: 'blur(4px)',
        }}
      />
    </div>
  )
}
