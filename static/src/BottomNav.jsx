// Cotton Candy — Global bottom navigation bar
// Floating rounded-rectangle dock with five tabs.

function BottomNav({ tk, active, onChange }) {
  const tabs = [
    { id: 'home',     label: 'Home',     Ico: IconHome },
    { id: 'chat',     label: 'Chat',     Ico: IconChat },
    { id: 'feel',     label: 'Feel',     Ico: IconFeel },
    { id: 'ours',     label: 'Ours',     Ico: IconOurs },
    { id: 'settings', label: 'Settings', Ico: IconSettings },
  ];

  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 16,
      zIndex: 30,
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: tk.nav,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 28,
        boxShadow: tk.dark
          ? '0 -2px 12px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35)'
          : '0 -1px 4px rgba(61,53,41,0.04), 0 12px 32px rgba(61,53,41,0.1)',
        border: tk.dark ? `0.5px solid ${tk.hairline}` : `0.5px solid ${tk.hairline}`,
        padding: '10px 6px 9px',
        display: 'flex', justifyContent: 'space-around',
        transition: `background-color ${tk.transition}`,
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '6px 8px 4px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              color: isActive ? tk.text : tk.textMuted,
              transition: `color ${tk.transition}`,
              position: 'relative',
              minWidth: 52,
            }}>
              <div style={{
                color: isActive ? tk.accent : tk.textMuted,
                transition: `color ${tk.transition}`,
              }}>
                <t.Ico size={22} stroke={isActive ? tk.accent : tk.textMuted} sw={1.6} />
              </div>
              <div style={{
                fontFamily: tk.serif, fontSize: 10.5, fontWeight: 500,
                letterSpacing: 0.4, color: isActive ? tk.text : tk.textMuted,
                opacity: isActive ? 1 : 0.75,
                transition: `all ${tk.transition}`,
              }}>{t.label}</div>
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: -4, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: 2,
                  background: tk.accent,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.BottomNav = BottomNav;
