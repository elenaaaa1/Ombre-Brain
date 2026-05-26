// Cotton Candy — Lock Screen
// Privacy gate. Centered logo + dotted password input. Subtle grain.

function LockScreen({ tk, onUnlock }) {
  const [pwd, setPwd] = React.useState('');
  const [shake, setShake] = React.useState(false);
  const [focused, setFocused] = React.useState(true);
  const inputRef = React.useRef(null);
  const DOT_COUNT = 6;

  // Autofocus the hidden input
  React.useEffect(() => {
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const onChange = (v) => {
    if (v.length > DOT_COUNT) return;
    setPwd(v);
    if (v.length === DOT_COUNT) {
      // any 6-digit input unlocks (it's a prototype)
      setTimeout(() => onUnlock && onUnlock(), 280);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: tk.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: 60, paddingBottom: 80,
      transition: `background-color ${tk.transition}`,
      overflow: 'hidden',
    }}
    onClick={() => inputRef.current && inputRef.current.focus()}>
      <CCGrain opacity={tk.dark ? 0.25 : 0.18} />

      <div style={{ flex: 1 }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 56, position: 'relative', zIndex: 2,
        animation: shake ? 'cc-shake 320ms ease' : 'none',
      }}>
        <CCLogo tk={tk} size={42} />

        {/* dotted password box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', height: 24 }}>
            {Array.from({ length: DOT_COUNT }).map((_, i) => {
              const filled = i < pwd.length;
              const isNext = i === pwd.length && focused;
              return (
                <div key={i} style={{ position: 'relative', width: 10, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: filled ? tk.accent : 'transparent',
                    border: `1.25px solid ${filled ? tk.accent : tk.hairline}`,
                    transition: `all ${tk.transition}`,
                    transform: filled ? 'scale(1)' : 'scale(0.9)',
                  }} />
                  {isNext && (
                    <div style={{
                      position: 'absolute', width: 1.5, height: 18,
                      background: tk.accent,
                      animation: 'cc-blink 1s steps(1) infinite',
                      borderRadius: 1,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{
            fontFamily: tk.sans, fontSize: 12, color: tk.textMuted,
            letterSpacing: 0.6, opacity: 0.75,
          }}>enter passcode</div>
        </div>

        {/* Hidden real input — captures keystrokes */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          value={pwd}
          onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'absolute', opacity: 0, pointerEvents: 'none',
            width: 1, height: 1, top: 0, left: 0,
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* hint at bottom */}
      <div style={{
        fontFamily: tk.serif, fontSize: 12, color: tk.textMuted,
        opacity: 0.4, fontStyle: 'italic',
        position: 'relative', zIndex: 2,
        textAlign: 'center', padding: '0 30px',
        letterSpacing: 0.4,
      }}>
        type anything to unlock
      </div>

      <style>{`
        @keyframes cc-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes cc-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

window.LockScreen = LockScreen;
