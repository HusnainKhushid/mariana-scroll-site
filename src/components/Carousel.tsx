import type { RefObject } from 'react'

export const SLIDES = [
  {
    title: 'Private\nReefs',
    body: 'Access to protected sites closed to general tourism.',
    tint: '#dff3e6',
    shade: '#b9e0c9',
    no: '01',
  },
  {
    title: 'Deep\nExpeditions',
    body: 'Technical descents beyond recreational limits.',
    tint: '#d6ecf5',
    shade: '#aed4e6',
    no: '02',
  },
  {
    title: 'Marine\nResearch',
    body: 'Dive alongside working reef scientists.',
    tint: '#faf0cf',
    shade: '#ecdca6',
    no: '03',
  },
  {
    title: 'Liveaboard\nCharter',
    body: 'Two-week passages with a crew of nine.',
    tint: '#e6dff5',
    shade: '#c9bee8',
    no: '04',
  },
  {
    title: 'Reef\nConservation',
    body: 'Every berth funds a hectare of coral restoration.',
    tint: '#f7dfe6',
    shade: '#e6bccd',
    no: '05',
  },
]

type Props = {
  /** the App's rAF loop writes transforms straight onto these nodes */
  cardsRef: RefObject<(HTMLDivElement | null)[]>
}

export default function Carousel({ cardsRef }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        // establishes the 3D context the cards rotate inside
        perspective: 1250,
        perspectiveOrigin: '50% 42%',
      }}
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            cardsRef.current[i] = el
          }}
          style={{
            position: 'absolute',
            top: '58%',
            left: '50%',
            width: 'clamp(146px, 13.5vw, 186px)',
            height: 'clamp(208px, 19.5vw, 268px)',
            borderRadius: 20,
            // a lit face rather than a flat fill, so the tilt reads as a solid
            background: `linear-gradient(152deg, #fff 0%, ${s.tint} 46%, ${s.shade} 100%)`,
            boxShadow: `
              0 1px 0 rgba(255,255,255,0.9) inset,
              0 26px 44px -12px rgba(52,38,78,0.42),
              0 8px 16px -6px rgba(52,38,78,0.28)`,
            border: '1px solid rgba(255,255,255,0.6)',
            padding: 'clamp(15px, 1.5vw, 20px)',
            display: 'flex',
            flexDirection: 'column',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'rgba(37,50,58,0.45)',
              fontWeight: 500,
            }}
          >
            {s.no}
          </span>

          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(17px, 1.6vw, 22px)',
              lineHeight: 1.12,
              color: '#25323a',
              whiteSpace: 'pre-line',
              marginTop: 'auto',
              marginBottom: 9,
            }}
          >
            {s.title}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(9px, 0.78vw, 11px)',
              lineHeight: 1.55,
              color: 'rgba(37,50,58,0.7)',
              fontWeight: 400,
            }}
          >
            {s.body}
          </p>

          <span
            style={{
              position: 'absolute',
              top: 13,
              right: 13,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 1px 3px rgba(52,38,78,0.18)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path
                d="M2 8L8 2M8 2H3.4M8 2V6.6"
                stroke="rgba(37,50,58,0.62)"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      ))}
    </div>
  )
}
