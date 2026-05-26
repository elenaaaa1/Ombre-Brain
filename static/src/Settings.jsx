// Cotton Candy — Settings

function Settings({ tk, themeMode, onSetThemeMode }) {
  const D = window.DATA;
  const [apiKey, setApiKey] = React.useState('sk-ant-•••••••••••••••');
  const [endpoint, setEndpoint] = React.useState('api.anthropic.com');
  const [fontSize, setFontSize] = React.useState(15);
  const u = D.usage;

  return (
    <div style={{ paddingTop: 64, paddingBottom: 140 }}>
      {/* title */}
      <div style={{ padding: '0 18px 18px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: tk.serif, fontSize: 24, fontWeight: 500,
          color: tk.text, letterSpacing: 0.3,
        }}>Settings</div>
      </div>

      {/* Usage monitor */}
      <div style={{ padding: '0 18px 22px' }}>
        <CCCard tk={tk} large>
          <div style={{
            fontFamily: tk.serif, fontStyle: 'italic', fontSize: 12,
            color: tk.textMuted, letterSpacing: 0.6, marginBottom: 14,
          }}>this month</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, marginBottom: 18,
          }}>
            {[
              { label: 'tokens', value: u.tokens },
              { label: 'cost',   value: u.cost },
              { label: 'cache',  value: u.cache },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: tk.sans, fontSize: 10, fontWeight: 500,
                  color: tk.textMuted, letterSpacing: 0.8,
                  textTransform: 'uppercase', marginBottom: 4,
                }}>{s.label}</div>
                <div style={{
                  fontFamily: tk.mono, fontSize: 17, fontWeight: 500,
                  color: tk.text, letterSpacing: 0.2,
                }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
              letterSpacing: 0.4, marginBottom: 5,
            }}>
              <span>budget</span>
              <span>{Math.round(u.budget * 100)}% of $10</span>
            </div>
            <div style={{
              height: 4, borderRadius: 2,
              background: tk.dark ? 'rgba(232,224,212,0.08)' : 'rgba(61,53,41,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: (u.budget * 100) + '%', height: '100%',
                background: tk.accent, borderRadius: 2,
                transition: `width ${tk.transition}`,
              }} />
            </div>
          </div>
        </CCCard>
      </div>

      {/* Sections */}
      <SettingsSection tk={tk} title="prompt & system">
        <SettingsRow tk={tk} label="System prompt" detail="CLAUDE.md" />
        <SettingsRow tk={tk} label="Default model" detail="Opus 4.6" />
      </SettingsSection>

      <SettingsSection tk={tk} title="api configuration">
        <SettingsField tk={tk} label="API Key" value={apiKey} onChange={setApiKey} mono mask />
        <SettingsField tk={tk} label="Endpoint" value={endpoint} onChange={setEndpoint} mono />
        <div style={{ padding: '6px 18px 14px' }}>
          <CCPill tk={tk} variant="ghost" size="sm">test connection</CCPill>
        </div>
      </SettingsSection>

      <SettingsSection tk={tk} title="appearance">
        {/* Theme segmented */}
        <div style={{
          padding: '14px 18px 4px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: tk.sans, fontSize: 14, color: tk.text, letterSpacing: 0.1,
          }}>Theme</div>
          <div style={{
            display: 'flex', gap: 2, padding: 3,
            background: tk.inputBg, borderRadius: 999,
          }}>
            {['light', 'dark', 'auto'].map(k => (
              <button key={k} onClick={() => onSetThemeMode(k)} style={{
                padding: '6px 12px', borderRadius: 999, border: 'none',
                background: themeMode === k ? tk.card : 'transparent',
                boxShadow: themeMode === k ? tk.shadowSoft : 'none',
                color: themeMode === k ? tk.text : tk.textMuted,
                fontFamily: tk.sans, fontSize: 11.5, fontWeight: 500,
                letterSpacing: 0.4, textTransform: 'lowercase', cursor: 'pointer',
                transition: `all ${tk.transition}`,
              }}>{k}</button>
            ))}
          </div>
        </div>
        {/* Font size slider */}
        <div style={{ padding: '14px 18px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: tk.sans, fontSize: 14, color: tk.text, letterSpacing: 0.1,
            }}>Font size</div>
            <div style={{
              fontFamily: tk.mono, fontSize: 11, color: tk.textMuted, letterSpacing: 0.3,
            }}>{fontSize}px</div>
          </div>
          <input type="range" min="12" max="18" step="1" value={fontSize}
            onChange={e => setFontSize(+e.target.value)}
            style={{
              width: '100%', accentColor: tk.accent,
              background: 'transparent',
            }} />
        </div>
      </SettingsSection>

      <SettingsSection tk={tk} title="connections / mcp">
        <ConnectionsBlock tk={tk} />
      </SettingsSection>

      <SettingsSection tk={tk} title="channels">
        <ChannelsBlock tk={tk} />
      </SettingsSection>

      <SettingsSection tk={tk} title="account & data">
        <SettingsRow tk={tk} label="Lock screen password" detail="change" />
        <SettingsRow tk={tk} label="Export data" />
        <SettingsRow tk={tk} label="Cache management" detail="2.4 MB" />
      </SettingsSection>

      <div style={{
        textAlign: 'center', padding: '32px 0 16px',
        fontFamily: tk.serif, fontStyle: 'italic', fontSize: 12,
        color: tk.textMuted, opacity: 0.55, letterSpacing: 0.3,
      }}>cotton candy · v0.4.2</div>
    </div>
  );
}

function SettingsSection({ tk, title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        padding: '0 24px 8px',
        fontFamily: tk.serif, fontStyle: 'italic', fontSize: 13,
        color: tk.textMuted, letterSpacing: 0.4, opacity: 0.8,
      }}>{title}</div>
      <div style={{ padding: '0 18px' }}>
        <CCCard tk={tk} padded={false}>
          {children}
        </CCCard>
      </div>
    </div>
  );
}

function SettingsRow({ tk, label, detail, chevron = true, isLast = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 18px',
      borderTop: `0.5px solid ${tk.hairline}`,
      cursor: 'pointer',
    }}>
      <div style={{
        flex: 1, fontFamily: tk.sans, fontSize: 14, color: tk.text, letterSpacing: 0.1,
      }}>{label}</div>
      {detail && (
        <div style={{
          fontFamily: tk.sans, fontSize: 13, color: tk.textMuted,
          marginRight: 8, fontStyle: 'italic',
        }}>{detail}</div>
      )}
      {chevron && <IconChevronRight size={14} stroke={tk.textMuted} />}
    </div>
  );
}

function SettingsField({ tk, label, value, onChange, mono = false, mask = false }) {
  const [shown, setShown] = React.useState(!mask);
  return (
    <div style={{
      padding: '14px 18px',
      borderTop: `0.5px solid ${tk.hairline}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <div style={{
          fontFamily: tk.sans, fontSize: 12, color: tk.textMuted,
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>{label}</div>
        {mask && (
          <button onClick={() => setShown(!shown)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: tk.accent, fontFamily: tk.sans, fontSize: 11,
            letterSpacing: 0.3,
          }}>{shown ? 'hide' : 'show'}</button>
        )}
      </div>
      <input
        value={shown ? value : '•'.repeat(Math.min(value.length, 24))}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          fontFamily: mono ? tk.mono : tk.sans,
          fontSize: 13, color: tk.text, letterSpacing: 0.2,
          padding: 0,
        }} />
    </div>
  );
}

window.Settings = Settings;

// — Connections / MCP block —
// Front-end mock. Each row is independently toggleable. Tapping the row opens a
// detail sheet with server address, auth status, last connection time, available
// tools list. "+ Add" opens a form for server URL + auth.
const INITIAL_MCPS = [
  { id: 'memory', name: 'Memory',  online: true,  enabled: true,
    server: 'mcp://localhost:9001/memory', auth: 'token · valid',
    last: '2m ago',
    tools: ['memory.recall', 'memory.write', 'memory.tag', 'memory.search'],
  },
  { id: 'github', name: 'GitHub',  online: true,  enabled: true,
    server: 'mcp://github.com/v1/mcp', auth: 'oauth · @ombre-brain',
    last: '14m ago',
    tools: ['repo.list', 'repo.read_file', 'repo.commit', 'pr.create'],
  },
  { id: 'gmail',  name: 'Gmail',   online: false, enabled: false,
    server: 'mcp://gmail.google.com/mcp', auth: 'oauth · expired',
    last: '3d ago',
    tools: ['inbox.list', 'message.read', 'message.compose'],
  },
  { id: 'drive',  name: 'Google Drive', online: true, enabled: false,
    server: 'mcp://drive.google.com/mcp', auth: 'oauth · @elena',
    last: '1d ago',
    tools: ['file.list', 'file.read', 'file.search'],
  },
];

function ConnectionsBlock({ tk }) {
  const [items, setItems] = React.useState(INITIAL_MCPS);
  const [open, setOpen]   = React.useState(null);
  const [adding, setAdding] = React.useState(false);

  const toggle = (id) => setItems(items.map(it => it.id === id ? { ...it, enabled: !it.enabled } : it));

  return (
    <React.Fragment>
      {items.map((it, i) => (
        <ConnRow key={it.id} tk={tk} item={it} isLast={i === items.length - 1}
          onOpen={() => setOpen(it)} onToggle={() => toggle(it.id)} />
      ))}
      <div onClick={() => setAdding(true)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '14px 18px',
        borderTop: `0.5px solid ${tk.hairline}`,
        cursor: 'pointer', color: tk.accent,
        fontFamily: tk.sans, fontSize: 13.5, fontWeight: 500, letterSpacing: 0.1,
      }}>
        <IconPlus size={13} stroke={tk.accent} sw={2} />
        Add connection
      </div>
      {open && <ConnDetail tk={tk} item={open} onClose={() => setOpen(null)} />}
      {adding && <ConnAdd tk={tk} onClose={() => setAdding(false)} onAdd={(newItem) => {
        setItems([...items, newItem]); setAdding(false);
      }} />}
    </React.Fragment>
  );
}

function ConnRow({ tk, item, isLast, onOpen, onToggle }) {
  const dotColor = item.enabled
    ? (item.online ? tk.accent : tk.textMuted)
    : tk.hairline;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 18px',
      borderTop: `0.5px solid ${tk.hairline}`,
    }}>
      <div onClick={onOpen} style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }}>
        {/* status dot */}
        <div style={{ position: 'relative', width: 8, height: 8 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 4,
            background: dotColor,
            boxShadow: (item.enabled && item.online) ? `0 0 6px ${tk.accent}88` : 'none',
            transition: `all ${tk.transition}`,
          }} />
        </div>
        <div style={{
          fontFamily: tk.sans, fontSize: 14, color: tk.text, letterSpacing: 0.1,
        }}>{item.name}</div>
        <div style={{
          fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
          letterSpacing: 0.3, opacity: 0.7,
        }}>{item.enabled ? (item.online ? 'online' : 'offline') : 'paused'}</div>
      </div>
      <Toggle tk={tk} on={item.enabled} onChange={onToggle} />
    </div>
  );
}

// Reusable iOS-style toggle. Calm, terracotta when on.
function Toggle({ tk, on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 38, height: 22, borderRadius: 11, border: 'none',
      background: on ? tk.accent : tk.hairline,
      position: 'relative', cursor: 'pointer', padding: 0,
      transition: `background ${tk.transition}`,
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: 9,
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transition: `left ${tk.transition}`,
      }} />
    </button>
  );
}

function ConnDetail({ tk, item, onClose }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70,
        animation: 'cc-fadein 200ms ease-out',
      }} />
      <div className="cc-scroll" style={{
        position: 'absolute', left: 8, right: 8, top: 60, bottom: 80, zIndex: 71,
        background: tk.bg, borderRadius: tk.radius.cardLg,
        boxShadow: tk.shadowLift,
        border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
        overflow: 'auto', padding: '22px 22px 28px',
        animation: 'cc-popin 240ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 9, height: 9, borderRadius: 5,
              background: item.online ? tk.accent : tk.textMuted,
              boxShadow: item.online ? `0 0 6px ${tk.accent}88` : 'none',
            }} />
            <div style={{
              fontFamily: tk.serif, fontSize: 24, fontWeight: 500, color: tk.text,
              letterSpacing: 0.3, lineHeight: 1.1,
            }}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 15, border: 'none',
            background: 'transparent', color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconClose size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
          <DetailField tk={tk} label="server" value={item.server} mono />
          <DetailField tk={tk} label="auth"   value={item.auth} />
          <DetailField tk={tk} label="last connection" value={item.last} mono />
        </div>

        <div style={{
          fontFamily: tk.serif, fontStyle: 'italic', fontSize: 13,
          color: tk.textMuted, letterSpacing: 0.4, marginBottom: 10,
        }}>available tools</div>
        <CCCard tk={tk} padded={false}>
          {item.tools.map((t, i) => (
            <div key={t} style={{
              padding: '11px 16px',
              borderTop: i === 0 ? 'none' : `0.5px solid ${tk.hairline}`,
              fontFamily: tk.mono, fontSize: 12, color: tk.text, letterSpacing: 0.3,
            }}>{t}</div>
          ))}
        </CCCard>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          <CCPill tk={tk} variant="ghost" size="sm">test connection</CCPill>
          <CCPill tk={tk} variant="ghost" size="sm">re-authenticate</CCPill>
          <CCPill tk={tk} variant="ghost" size="sm">remove</CCPill>
        </div>
      </div>
    </React.Fragment>
  );
}

function DetailField({ tk, label, value, mono = false }) {
  return (
    <div>
      <div style={{
        fontFamily: tk.sans, fontSize: 11, color: tk.textMuted,
        letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: mono ? tk.mono : tk.sans,
        fontSize: 13.5, color: tk.text, letterSpacing: 0.2, lineHeight: 1.5,
        wordBreak: 'break-all',
      }}>{value}</div>
    </div>
  );
}

function ConnAdd({ tk, onClose, onAdd }) {
  const [name, setName] = React.useState('');
  const [server, setServer] = React.useState('mcp://');
  const [auth, setAuth] = React.useState('');

  const submit = () => {
    if (!name.trim() || !server.trim()) return;
    onAdd({
      id: 'c_' + Date.now(),
      name: name.trim(),
      online: false, enabled: true,
      server: server.trim(),
      auth: auth.trim() || 'pending',
      last: 'never',
      tools: [],
    });
  };

  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70,
        animation: 'cc-fadein 200ms ease-out',
      }} />
      <div style={{
        position: 'absolute', left: 16, right: 16, top: '14%', zIndex: 71,
        background: tk.card, borderRadius: tk.radius.cardLg,
        boxShadow: tk.shadowLift,
        border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
        padding: 22,
        animation: 'cc-popin 240ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{
            fontFamily: tk.serif, fontSize: 17, fontWeight: 500, color: tk.text,
            letterSpacing: 0.2,
          }}>add connection</div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 14, border: 'none',
            background: tk.inputBg, color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconClose size={12} /></button>
        </div>
        <AddField tk={tk} label="Name" value={name} onChange={setName} placeholder="e.g. Notion" />
        <AddField tk={tk} label="Server URL" value={server} onChange={setServer} mono />
        <AddField tk={tk} label="Auth (token / oauth)" value={auth} onChange={setAuth} placeholder="optional" mono last />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 8 }}>
          <CCPill tk={tk} variant="ghost" size="sm" onClick={onClose}>cancel</CCPill>
          <CCPill tk={tk} variant="filled" size="sm" onClick={submit}>add</CCPill>
        </div>
      </div>
    </React.Fragment>
  );
}

function AddField({ tk, label, value, onChange, placeholder, mono = false, last = false }) {
  return (
    <div style={{ marginBottom: last ? 18 : 14 }}>
      <div style={{
        fontFamily: tk.sans, fontSize: 11, color: tk.textMuted,
        letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', background: tk.inputBg, border: 'none', outline: 'none',
          borderRadius: tk.radius.btn, padding: '10px 12px',
          fontFamily: mono ? tk.mono : tk.sans,
          fontSize: 13, color: tk.text, letterSpacing: 0.2,
        }} />
    </div>
  );
}

// — Channels block —
const INITIAL_CHANNELS = [
  { id: 'api',  name: 'API 直连',         desc: '\u524d\u7aef\u76f4\u63a5\u8c03\u7528 anthropic api',
    running: true, controllable: true },
  { id: 'tg',   name: 'Telegram bot',    desc: '\u540e\u53f0\u8fdb\u7a0b bot.py',
    running: true, controllable: true },
  { id: 'cli',  name: 'Claude Code CLI', desc: '\u7ec8\u7aef\u542f\u52a8 \u00b7 \u4ec5\u72b6\u6001\u663e\u793a',
    running: false, controllable: false },
];

function ChannelsBlock({ tk }) {
  const [chans, setChans] = React.useState(INITIAL_CHANNELS);
  const toggle = (id) => setChans(chans.map(c =>
    c.id === id ? (c.controllable ? { ...c, running: !c.running } : c) : c
  ));

  return (
    <React.Fragment>
      {chans.map((c, i) => (
        <div key={c.id} style={{
          display: 'flex', alignItems: 'center', padding: '14px 18px',
          borderTop: i === 0 ? 'none' : `0.5px solid ${tk.hairline}`,
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 4,
              background: c.running ? tk.accent : tk.hairline,
              boxShadow: c.running ? `0 0 6px ${tk.accent}88` : 'none',
              transition: `all ${tk.transition}`,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: tk.sans, fontSize: 14, color: tk.text, letterSpacing: 0.1,
              }}>{c.name}</div>
              <div style={{
                fontFamily: tk.sans, fontSize: 11.5, color: tk.textMuted,
                fontStyle: 'italic', marginTop: 2, letterSpacing: 0.1,
              }}>{c.desc}</div>
            </div>
            <div style={{
              fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
              letterSpacing: 0.3, opacity: 0.75, marginRight: 6,
            }}>{c.running ? '\u8fd0\u884c\u4e2d' : '\u5df2\u505c\u6b62'}</div>
          </div>
          {c.controllable ? (
            <Toggle tk={tk} on={c.running} onChange={() => toggle(c.id)} />
          ) : (
            <div style={{
              fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
              letterSpacing: 0.3, opacity: 0.55,
              padding: '4px 8px', border: `0.5px solid ${tk.hairline}`,
              borderRadius: 999,
            }}>terminal</div>
          )}
        </div>
      ))}
    </React.Fragment>
  );
}
