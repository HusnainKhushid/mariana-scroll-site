type Card =
  | { img: string; kind: 'play'; label: string }
  | { img: string; kind: 'stat'; value: string; label: string }

const CARDS: Card[] = [
  { img: '/card1.webp', kind: 'play', label: 'Watch Film' },
  { img: '/card2.webp', kind: 'stat', value: '34', label: 'Reef Sites' },
  { img: '/card3.webp', kind: 'play', label: 'Watch Film' },
]

function PlayIcon() {
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden>
        <path d="M0 0L9 5L0 10Z" fill="#0b2b33" />
      </svg>
    </span>
  )
}

export default function HeroCards() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end',
        animation: 'fadeUp 1s ease 0.5s both',
      }}
    >
      {CARDS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            width: 'clamp(104px, 11vw, 152px)',
            height: 'clamp(124px, 13vw, 178px)',
            borderRadius: 18,
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 10px 34px rgba(2,16,22,0.55)',
            border: '1px solid rgba(243,239,230,0.14)',
          }}
        >
          <img
            src={c.img}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(4,22,29,0.86) 0%, rgba(4,22,29,0.22) 52%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            {c.kind === 'play' ? (
              <>
                <PlayIcon />
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: 1.25,
                    color: 'rgba(243,239,230,0.95)',
                    fontWeight: 400,
                  }}
                >
                  {c.label}
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 30,
                    lineHeight: 0.9,
                    color: '#fff',
                  }}
                >
                  {c.value}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: 1.25,
                    color: 'rgba(243,239,230,0.9)',
                  }}
                >
                  {c.label}
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
