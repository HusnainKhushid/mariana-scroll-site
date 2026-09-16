import { useEffect, useRef } from 'react'
import Nav from './components/Nav'
import HeroCards from './components/HeroCards'
import Carousel, { SLIDES } from './components/Carousel'
import { HERO_LAYERS, clamp, ease, lerp, range } from './lib/anim'

/** Total scroll distance. 6x viewport gives the fly-through room to breathe. */
const SCROLL_VH = 600

export default function App() {
  const layersRef = useRef<(HTMLImageElement | null)[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const scene2Ref = useRef<HTMLDivElement>(null)
  const sky2Ref = useRef<HTMLImageElement>(null)
  const podiumRef = useRef<HTMLImageElement>(null)
  const foamRef = useRef<HTMLImageElement>(null)
  const head2Ref = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // pointer parallax, lerped toward the real cursor each tick
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const max = document.body.scrollHeight - window.innerHeight
      const sp = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
      const ep = ease(sp)

      // pointer easing
      mouse.current.x = lerp(mouse.current.x, target.current.x, 0.06)
      mouse.current.y = lerp(mouse.current.y, target.current.y, 0.06)
      const { x: rx, y: ry } = mouse.current

      // ── hero planes ─────────────────────────────────────────────
      // The arch reaches scale 9 and passes the lens; everything nearer
      // than it leaves frame sooner, everything behind it barely moves.
      HERO_LAYERS.forEach((L, i) => {
        const el = layersRef.current[i]
        if (!el) return

        const base = L.base ?? 1
        const scale = base * lerp(L.scale[0], L.scale[1], ep)
        // divide the pointer offset by scale so the wiggle does not balloon
        // as a plane zooms past the camera
        const damp = Math.max(scale, 1)
        const px = (rx * L.mouse) / damp + (L.driftX ?? 0) * ep
        const py = (ry * L.mouse) / damp + (L.driftY ?? 0) * ep

        const ox = L.offsetX ?? 0
        const oy = L.offsetY ?? 0
        el.style.transform = `translate(${ox}%, ${oy}%) translate3d(${px}px, ${py}px, 0) scale(${scale})`
        // Nearer planes clear out early so they stop occluding the obelisk we
        // are travelling toward; the backplates hold until scene two arrives.
        const [f0, f1] = L.fade ?? [0.5, 0.62]
        el.style.opacity = String(1 - range(sp, f0, f1))
      })

      // ── hero copy ───────────────────────────────────────────────
      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - range(sp, 0.02, 0.24))
        heroRef.current.style.transform = `translateY(${sp * -50}px)`
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - range(sp, 0.0, 0.12))
      }

      // ── scene two ───────────────────────────────────────────────
      const s2 = range(sp, 0.46, 0.64)
      if (scene2Ref.current) {
        scene2Ref.current.style.opacity = String(s2)
        scene2Ref.current.style.pointerEvents = s2 > 0.5 ? 'auto' : 'none'
      }
      if (sky2Ref.current) {
        const k = lerp(1.18, 1.0, s2)
        sky2Ref.current.style.transform = `translate3d(${rx * 6}px, ${ry * 6}px, 0) scale(${k})`
      }
      if (podiumRef.current) {
        const k = lerp(1.3, 1.0, s2)
        podiumRef.current.style.transform = `translate3d(${rx * 12}px, ${ry * 12}px, 0) scale(${k})`
      }
      if (foamRef.current) {
        foamRef.current.style.transform = `translate3d(${rx * 20}px, ${ry * 10 + lerp(60, 0, s2)}px, 0) scale(1.05)`
      }
      if (head2Ref.current) {
        head2Ref.current.style.opacity = String(range(sp, 0.52, 0.66))
        head2Ref.current.style.transform = `translateY(${lerp(26, 0, range(sp, 0.52, 0.68))}px)`
      }

      // ── card track ──────────────────────────────────────────────
      // The cards ride a shallow arc rather than a full circle: each one
      // enters from the left, rises to the crown of the arc facing the
      // viewer, then drops away right. Scroll advances every card along the
      // same track, and the track wraps so the row never runs out.
      const prog = range(sp, 0.5, 1)
      const spread = Math.min(window.innerWidth * 0.42, 560)
      const arcDrop = 96
      const n = SLIDES.length

      cardsRef.current.forEach((el, i) => {
        if (!el) return
        // u runs -1 (far left) -> 0 (crown) -> +1 (far right), wrapping
        const t = (i / n + prog * 1.15) % 1
        const u = t * 2 - 1

        const x = u * spread
        const y = u * u * arcDrop // crown at centre, shoulders dip away
        // the arc bulges toward the viewer, so the ends sit further back
        const z = -Math.abs(u) * 260
        // ...and turn to follow it: the card's inner edge stays nearer the lens
        const rotY = u * 38
        const rot = u * 9 // a little lean on top of the turn
        const s = lerp(1.0, 0.9, Math.abs(u))
        // fade the two ends so cards slip in and out rather than popping
        const op = 1 - range(Math.abs(u), 0.62, 0.96)

        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotY}deg) rotate(${rot}deg) scale(${s})`
        el.style.zIndex = String(200 - Math.round(Math.abs(u) * 100))
        el.style.opacity = String(op)
      })
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ height: `${SCROLL_VH}vh`, position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          contain: 'layout style paint',
          background: '#04161d',
        }}
      >
        {/* ── SCENE ONE : the coral arch ─────────────────────────── */}
        {HERO_LAYERS.map((L, i) => (
          <img
            key={L.src}
            src={L.src}
            alt=""
            ref={(el) => {
              layersRef.current[i] = el
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transformOrigin: L.origin ?? '50% 50%',
              zIndex: L.z,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* depth vignette, sits above the plates but below the copy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 9,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 78% 68% at 50% 48%, transparent 22%, rgba(3,17,23,0.62) 100%)',
          }}
        />

        <Nav />

        {/* ── HERO COPY ──────────────────────────────────────────── */}
        <div
          data-section="01-hero"
          ref={heroRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            padding: '0 clamp(20px, 4vw, 52px) clamp(28px, 4vw, 52px)',
            willChange: 'opacity, transform',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: 470,
              animation: 'fadeUp 1s ease 0.3s both',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-60%',
                left: '-40%',
                width: '180%',
                height: '220%',
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle at 50% 50%, rgba(2,14,20,0.52) 0%, rgba(2,14,20,0.26) 36%, rgba(2,14,20,0.06) 62%, transparent 76%)',
              }}
            />
            <h1
              style={{
                position: 'relative',
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 'clamp(42px, 6.4vw, 92px)',
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
                color: '#fff',
                textShadow:
                  '0 4px 40px rgba(79,214,208,0.28), 0 2px 16px rgba(0,0,0,0.7)',
              }}
            >
              DIVE{' '}
              <span style={{ fontWeight: 400, opacity: 0.9 }}>›</span>
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 400 }}>INTO</em>{' '}
              SILENCE
            </h1>
            <p
              style={{
                position: 'relative',
                margin: '20px 0 0',
                maxWidth: 330,
                fontWeight: 300,
                fontSize: 'clamp(12px, 1.2vw, 14px)',
                lineHeight: 1.75,
                color: 'rgba(226,240,238,0.78)',
              }}
            >
              Small-group descents to the last untouched reefs, led by marine
              scientists and master divers.
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 30 }}>
              {[28, 14, 14, 14].map((w, i) => (
                <span
                  key={i}
                  style={{
                    width: w,
                    height: 3,
                    borderRadius: 3,
                    background:
                      i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.32)',
                  }}
                />
              ))}
            </div>
          </div>

          <HeroCards />
        </div>

        {/* ── SCROLL CUE ─────────────────────────────────────────── */}
        <div
          ref={cueRef}
          style={{
            position: 'absolute',
            bottom: 26,
            left: '50%',
            zIndex: 11,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            pointerEvents: 'none',
            animation: 'fadeUp 1s ease 0.8s both, bob 2.4s ease-in-out 1.8s infinite',
          }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'rgba(160,225,220,0.6)',
            }}
          >
            Descend
          </span>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '1px solid rgba(79,214,208,0.35)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M2 4l4 4 4-4"
                stroke="rgba(180,235,230,0.8)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </div>

        {/* ── SCENE TWO : the surface ────────────────────────────── */}
        <div
          data-section="02-surface"
          ref={scene2Ref}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            opacity: 0,
            willChange: 'opacity',
            pointerEvents: 'none',
          }}
        >
          <img
            ref={sky2Ref}
            src={`${import.meta.env.BASE_URL}sky2.webp`}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              willChange: 'transform',
            }}
          />
          <img
            ref={podiumRef}
            src={`${import.meta.env.BASE_URL}podium.webp`}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              willChange: 'transform',
            }}
          />
          <img
            ref={foamRef}
            src={`${import.meta.env.BASE_URL}foam.webp`}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 300,
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          />

          <Carousel cardsRef={cardsRef} />

          <div
            ref={head2Ref}
            style={{
              position: 'absolute',
              top: 'clamp(72px, 12vh, 128px)',
              left: 0,
              right: 0,
              zIndex: 400,
              textAlign: 'center',
              padding: '0 24px',
              opacity: 0,
              willChange: 'opacity, transform',
              pointerEvents: 'none',
            }}
          >
            {/* scrim: the cloud band behind this is bright enough to swallow the copy */}
            <div
              style={{
                position: 'absolute',
                top: '-70%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(900px, 92vw)',
                height: '260%',
                pointerEvents: 'none',
                background:
                  'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(26,42,72,0.46) 0%, rgba(26,42,72,0.24) 45%, transparent 72%)',
              }}
            />
            <h2
              style={{
                position: 'relative',
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: 'clamp(28px, 4.4vw, 60px)',
                letterSpacing: '0.01em',
                lineHeight: 1.05,
                color: '#fff',
                textShadow: '0 2px 26px rgba(80,60,120,0.35)',
              }}
            >
              EXPLORE BEYOND DEPTH
            </h2>
            <p
              style={{
                position: 'relative',
                margin: '16px auto 0',
                maxWidth: 500,
                fontWeight: 400,
                fontSize: 'clamp(12px, 1.15vw, 14px)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.94)',
                textShadow:
                  '0 1px 3px rgba(24,38,64,0.8), 0 2px 18px rgba(24,38,64,0.65)',
              }}
            >
              Chartered passages to reefs that only open to nine guests a season —
              logged, protected, and left exactly as we found them.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
