// Cotton Candy — shared UI primitives

// Card — soft, breathing surface. Day=soft warm shadow. Night=subtle border.
function CCCard({ tk, children, style = {}, onClick, padded = true, large = false }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      onMouseDown={() => onClick && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        background: tk.card,
        borderRadius: large ? tk.radius.cardLg : tk.radius.card,
        boxShadow: tk.dark ? 'none' : tk.shadowSoft,
        border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
        padding: padded ? tk.space.cardPad : 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: `transform ${tk.transition}, box-shadow ${tk.transition}, background-color ${tk.transition}`,
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        ...style,
      }}
    >{children}</div>
  );
}

// Soft button — pill, terracotta filled or ghost
function CCPill({ tk, children, onClick, variant = 'filled', size = 'sm', style = {}, icon = null }) {
  const filled = variant === 'filled';
  const ghost  = variant === 'ghost';
  const pad = size === 'sm' ? '7px 14px' : '11px 18px';
  const fontSize = size === 'sm' ? 13 : 14;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad,
        background: filled ? tk.accent : ghost ? 'transparent' : tk.inputBg,
        color: filled ? '#fff' : tk.text,
        border: ghost ? `1px solid ${tk.hairline}` : 'none',
        borderRadius: tk.radius.pill,
        fontFamily: tk.sans, fontSize, fontWeight: 500, letterSpacing: 0.1,
        cursor: 'pointer',
        transition: `background-color ${tk.transition}, transform ${tk.transition}, opacity ${tk.transition}`,
        ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon}
      {children}
    </button>
  );
}

// Section label — serif, secondary color
function CCSectionLabel({ tk, children, hairline = true, action = null, style = {} }) {
  return (
    <div style={{ ...style }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        paddingBottom: 10,
      }}>
        <div style={{
          fontFamily: tk.serif, fontSize: 19, fontWeight: 500,
          color: tk.textMuted, letterSpacing: 0.6,
          fontStyle: 'italic',
        }}>{children}</div>
        {action}
      </div>
      {hairline && <div style={{ height: 1, background: tk.hairline, marginBottom: 18 }} />}
    </div>
  );
}

// Avatar — initial in a soft tinted circle
function CCAvatar({ tk, name, size = 32, tone }) {
  const initial = (name || '?').slice(0, 1);
  const bg = tone || tk.accent2;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: bg + '33',
      color: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: tk.serif, fontWeight: 500, fontSize: size * 0.5,
      letterSpacing: 0.2,
      flexShrink: 0,
    }}>{initial}</div>
  );
}

// Subtle grain background overlay — gives "warmth" without printing real noise
function CCGrain({ opacity = 0.4 }) {
  // Use a tiny SVG noise turbulence as a tiled background
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"/></filter><rect width="160" height="160" filter="url(%23n)"/></svg>`
  );
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml,${svg}")`,
      opacity, mixBlendMode: 'multiply',
    }} />
  );
}

// Placeholder image — striped, with a label. Used wherever the spec calls for
// imagery we don't have. Designed to feel intentional, not "missing".
function CCImagePlaceholder({ tk, label = 'image', height = 180, ratio = null, style = {} }) {
  const h = ratio ? undefined : height;
  return (
    <div style={{
      width: '100%', height: h, aspectRatio: ratio || undefined,
      borderRadius: tk.radius.card,
      backgroundImage: `repeating-linear-gradient(135deg, ${tk.inputBg} 0 12px, transparent 12px 24px)`,
      backgroundColor: tk.dark ? 'rgba(232,224,212,0.03)' : 'rgba(184,92,58,0.04)',
      border: `0.5px dashed ${tk.hairline}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: tk.textMuted,
      fontFamily: tk.mono, fontSize: 11, letterSpacing: 0.6,
      textTransform: 'uppercase',
      ...style,
    }}>{label}</div>
  );
}

// Logo — "cotton candy" lowercase serif, terracotta, wide tracking
function CCLogo({ tk, size = 38, style = {} }) {
  return (
    <div style={{
      fontFamily: tk.serif, fontSize: size, fontWeight: 400,
      color: tk.accent, letterSpacing: size * 0.04,
      lineHeight: 1.1, ...style,
    }}>cotton candy</div>
  );
}

Object.assign(window, {
  CCCard, CCPill, CCSectionLabel, CCAvatar, CCGrain, CCImagePlaceholder, CCLogo,
});
