// Cotton Candy — App entry. Holds global state and routes between pages.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "themeMode": "light",
  "accent": "#B85C3A",
  "serif": "source",
  "radiusScale": 1.1
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Pending Chat attachment — a file from Study (or any other room) the user wants
  // to bring into the conversation. Set via window.CC_GO_TO_CHAT_WITH so any
  // deep child can request it without prop-drilling.
  const [pendingAttachment, setPendingAttachment] = React.useState(null);

  // Theme: light / dark / auto (auto = night between 19:00-7:00 in this prototype)
  const [systemDark, setSystemDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const dark = tweaks.themeMode === 'dark'
    ? true
    : tweaks.themeMode === 'light'
      ? false
      : systemDark;

  const tk = useTokens(dark, tweaks);

  // App state
  const [locked, setLocked] = React.useState(true);
  const [page, setPage] = React.useState('home');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Transitions between pages: simple fade-up
  const [transitionKey, setTransitionKey] = React.useState(0);
  const goTo = (p) => {
    if (p === page) return;
    setSidebarOpen(false);
    setPage(p);
    setTransitionKey(k => k + 1);
  };

  // Expose cross-tree chat-attach hook on window. Deep children (Study file rows)
  // call this to bring a file into the Chat tab and surface it in the composer.
  React.useEffect(() => {
    window.CC_GO_TO_CHAT_WITH = (att) => {
      setPendingAttachment(att);
      setSidebarOpen(false);
      setPage('chat');
      setTransitionKey(k => k + 1);
    };
    return () => { window.CC_GO_TO_CHAT_WITH = null; };
  }, []);

  return (
    <>
      <Stage tk={tk}>
        <IOSDevice dark={dark} width={402} height={874}>
          {/* Body */}
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            background: tk.bg,
            transition: `background-color 280ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
            overflow: 'hidden',
          }}>
            {locked ? (
              <LockScreen tk={tk} onUnlock={() => setLocked(false)} />
            ) : (
              <>
                <div key={transitionKey} className="cc-scroll" style={{
                  width: '100%', height: '100%',
                  overflow: 'auto',
                  animation: 'cc-pagein 320ms cubic-bezier(0.2, 0.8, 0.4, 1)',
                }}>
                  {page === 'home' && <Home tk={tk}
                    onEnterChat={() => goTo('chat')}
                    onSeeAllHeartbeat={() => goTo('chat')} />}
                  {page === 'chat' && <Chat tk={tk}
                    sidebarOpen={sidebarOpen}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onCloseSidebar={() => setSidebarOpen(false)}
                    pendingAttachment={pendingAttachment}
                    onClearAttachment={() => setPendingAttachment(null)} />}
                  {page === 'feel' && <Feel tk={tk} />}
                  {page === 'ours' && <Ours tk={tk} />}
                  {page === 'settings' && <Settings tk={tk}
                    themeMode={tweaks.themeMode}
                    onSetThemeMode={(m) => setTweak('themeMode', m)} />}
                </div>
                <BottomNav tk={tk} active={page} onChange={goTo} />
                {/* tiny lock button (top right) to demo lockscreen again */}
                <button onClick={() => setLocked(true)} title="Lock"
                  aria-label="Lock"
                  style={{
                    position: 'absolute', top: 18, right: 16, zIndex: 6,
                    width: 30, height: 30, borderRadius: 15,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: tk.textMuted, opacity: 0.55,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2"/>
                    <path d="M8 11V8a4 4 0 018 0v3"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </IOSDevice>
      </Stage>

      <CottonTweaks tweaks={tweaks} setTweak={setTweak} />

      <style>{`
        @keyframes cc-pagein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// Soft stage around the phone — caption, vibe text. Doesn't compete with the device.
function Stage({ tk, children }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, padding: 12,
    }}>
      <div style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: 22, fontWeight: 500, fontStyle: 'italic',
        color: 'rgba(232, 224, 212, 0.65)',
        letterSpacing: 0.3,
      }}>cotton candy <span style={{ opacity: 0.4, padding: '0 6px' }}>·</span> <span style={{ fontSize: 14 }}>cottoncandyluv.cc</span></div>
      <div>{children}</div>
      <div style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 11, color: 'rgba(232, 224, 212, 0.4)',
        letterSpacing: 0.6, textTransform: 'uppercase',
        marginTop: 4,
      }}>tap the screen · navigate via the bottom dock</div>
    </div>
  );
}

// — Tweaks panel —
function CottonTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={tweaks.themeMode}
          onChange={v => setTweak('themeMode', v)}
          options={[
            { value: 'light', label: 'Day' },
            { value: 'dark',  label: 'Night' },
            { value: 'auto',  label: 'Auto' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
