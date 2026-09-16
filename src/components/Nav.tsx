const linkStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(243,239,230,0.82)',
  fontWeight: 500,
  textDecoration: 'none',
}

const LEFT = ['Home', 'Vessels', 'Expeditions']
const RIGHT = ['Research', 'Journal', 'Contact']

/** A compass rose, drawn rather than imported so it inherits currentColor. */
function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path
        d="M13 1.5 15.1 10.9 24.5 13 15.1 15.1 13 24.5 10.9 15.1 1.5 13 10.9 10.9Z"
        fill="none"
        stroke="rgba(243,239,230,0.92)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="13" r="2.4" stroke="rgba(79,214,208,0.9)" strokeWidth="1.1" />
    </svg>
  )
}

export default function Nav() {
  return (
    <nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '22px clamp(20px, 4vw, 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 'clamp(14px, 2.4vw, 32px)' }}>
        {LEFT.map((l) => (
          <a key={l} href="#" style={linkStyle}>
            {l}
          </a>
        ))}
      </div>

      <Mark />

      <div style={{ display: 'flex', gap: 'clamp(14px, 2.4vw, 32px)' }}>
        {RIGHT.map((l) => (
          <a key={l} href="#" style={linkStyle}>
            {l}
          </a>
        ))}
      </div>
    </nav>
  )
}
