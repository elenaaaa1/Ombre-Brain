// Cotton Candy — Design Tokens
// All color values are low-saturation, natural pigments. Two palettes (day/night)
// chosen by the active theme. `useTokens(dark, tweaks)` returns a flat token bag
// the rest of the app reads from.

const PALETTES = {
  day: {
    bg: '#F5F0E8',       // warm cream
    paper: '#FAF7F2',    // warm paper white
    card: '#FFFDF9',     // card surface, slight warm tint
    nav: '#FBF8F3',      // navbar — one shade lighter than base
    text: '#3D3529',     // warm charcoal
    textMuted: '#8A7E6B', // muted brown
    hairline: 'rgba(61,53,41,0.10)',
    divider: 'rgba(61,53,41,0.06)',
    inputBg: 'rgba(61,53,41,0.04)',
    shadowSoft: '0 1px 2px rgba(61,53,41,0.04), 0 8px 24px rgba(61,53,41,0.05)',
    shadowLift: '0 2px 6px rgba(61,53,41,0.06), 0 14px 36px rgba(61,53,41,0.08)',
    accents: {
      terracotta: '#B85C3A',
      fog:        '#7E9BAB',
      moss:       '#7B8A5F',
      clay:       '#A66A4A',
    },
  },
  night: {
    bg: '#1A1A1E',
    paper: '#1B2530', // alt dim variant (deep navy-teal) — used for some surfaces
    card: '#242428',
    nav: '#15151A',
    text: '#E8E0D4',
    textMuted: '#9A9083',
    hairline: 'rgba(232,224,212,0.10)',
    divider: 'rgba(232,224,212,0.06)',
    inputBg: 'rgba(232,224,212,0.05)',
    shadowSoft: '0 1px 2px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.35)',
    shadowLift: '0 1px 2px rgba(0,0,0,0.5), 0 18px 40px rgba(0,0,0,0.4)',
    accents: {
      terracotta: '#C4785A',
      fog:        '#8AAABB',
      moss:       '#9AAB7A',
      clay:       '#C08868',
    },
  },
};

const SERIF_STACKS = {
  cormorant: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
  playfair:  '"Playfair Display", "Iowan Old Style", Georgia, serif',
  source:    '"Source Serif 4", "Iowan Old Style", Georgia, serif',
};

// Map of light-mode hex -> dark-mode hex so the accent stays coherent in both modes
const ACCENT_PAIRS = {
  '#B85C3A': '#C4785A', // terracotta -> softened terracotta
  '#7E9BAB': '#8AAABB', // fog -> softened fog
  '#7B8A5F': '#9AAB7A', // moss
  '#A66A4A': '#C08868', // clay
};

function useTokens(dark, tweaks = {}) {
  const palette = dark ? PALETTES.night : PALETTES.day;
  // tweaks.accent is a hex string (light-mode value). Map to the dark variant when dark.
  const lightAccent = tweaks.accent || '#B85C3A';
  const accent = dark ? (ACCENT_PAIRS[lightAccent] || lightAccent) : lightAccent;
  const accent2 = palette.accents.fog;
  const radiusMul = tweaks.radiusScale ?? 1; // 0.6 .. 1.4

  return {
    dark,
    ...palette,
    accent,
    accent2,
    serif: SERIF_STACKS[tweaks.serif || 'cormorant'],
    sans: '"Inter", -apple-system, system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
    radius: {
      card: Math.round(20 * radiusMul),
      cardLg: Math.round(24 * radiusMul),
      btn: Math.round(12 * radiusMul),
      pill: 9999,
      input: Math.round(14 * radiusMul),
    },
    space: {
      cardPad: 22,
      gap: 16,
      gapLg: 20,
    },
    transition: '220ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  };
}

window.useTokens = useTokens;
window.PALETTES = PALETTES;
