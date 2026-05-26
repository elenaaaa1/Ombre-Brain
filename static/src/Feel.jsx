// Cotton Candy — Feel
// Shared two-person feed. Soft breathing cards. Both can post + comment.

function Feel({ tk }) {
  const D = window.DATA;
  const [posts, setPosts] = React.useState(D.feels);
  const [composing, setComposing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [savedToast, setSavedToast] = React.useState(null);
  const [calOpen, setCalOpen] = React.useState(false);

  const toggleHeart = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, hearted: !p.hearted } : p));
  };

  const toggleSave = (id) => {
    const target = posts.find(p => p.id === id);
    const willSave = !target.saved;
    setPosts(posts.map(p => p.id === id ? { ...p, saved: willSave } : p));
    if (willSave) {
      setSavedToast('saved to museum');
      setTimeout(() => setSavedToast(null), 1800);
    }
  };

  const addComment = (id, text) => {
    if (!text.trim()) return;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setPosts(posts.map(p => p.id === id ? {
      ...p, comments: [...p.comments, { who: 'user', name: 'you', t, text: text.trim() }]
    } : p));
  };

  // expose saved feels to Museum (Ours tab) via a window-level store
  React.useEffect(() => {
    window.SAVED_FEELS = posts.filter(p => p.saved);
    window.dispatchEvent(new CustomEvent('cc-saved-feels-changed'));
  }, [posts]);

  const submitPost = (attached) => {
    if (!draft.trim() && !attached) return;
    const now = new Date();
    const t = `today \u00b7 ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setPosts([{
      id: 'new_' + Date.now(),
      who: 'user', name: 'Elena', t, text: draft.trim(),
      img: attached ? attached.url : null,
      imgIsDataURL: !!attached,
      comments: [], hearted: false, saved: false,
    }, ...posts]);
    setDraft('');
    setComposing(false);
  };

  return (
    <div style={{ paddingTop: 64, paddingBottom: 140, position: 'relative' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 18px 18px', position: 'relative',
      }}>
        <button onClick={() => setCalOpen(true)} style={{
          position: 'absolute', left: 18, top: 0,
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: tk.inputBg, color: tk.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} title="日历">
          {/* small calendar icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={tk.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="15" rx="2"/>
            <path d="M4 9.5h16M8 3v4M16 3v4"/>
          </svg>
        </button>
        <div style={{
          fontFamily: tk.serif, fontSize: 24, fontWeight: 500,
          color: tk.text, letterSpacing: 0.3,
        }}>Feel</div>
        <button onClick={() => setComposing(true)} style={{
          position: 'absolute', right: 18, top: 0,
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: tk.inputBg, color: tk.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconPen size={16} stroke={tk.accent} /></button>
      </div>

      {/* feed */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {posts.map(p => (
          <FeelPost key={p.id} tk={tk} post={p}
            onHeart={() => toggleHeart(p.id)}
            onSave={() => toggleSave(p.id)}
            onComment={(text) => addComment(p.id, text)} />
        ))}
      </div>

      {/* compose modal */}
      {composing && (
        <ComposeModal tk={tk} value={draft} onChange={setDraft}
          onSubmit={submitPost} onClose={() => setComposing(false)} />
      )}

      {/* calendar */}
      {calOpen && <FeelCalendar tk={tk} counts={D.feelCounts} onClose={() => setCalOpen(false)} />}

      {/* toast */}
      {savedToast && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 110,
          transform: 'translateX(-50%)',
          background: tk.text, color: tk.bg,
          padding: '9px 16px', borderRadius: 999,
          fontFamily: tk.serif, fontStyle: 'italic', fontSize: 13,
          letterSpacing: 0.4, zIndex: 60,
          boxShadow: tk.shadowLift,
          animation: 'cc-toast 200ms ease-out',
        }}>{savedToast}</div>
      )}
      <style>{`
        @keyframes cc-toast {
          from { opacity: 0; transform: translate(-50%, 6px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

function FeelPost({ tk, post, onHeart, onSave, onComment }) {
  const [expanded, setExpanded] = React.useState(false);
  const [reply, setReply] = React.useState('');

  // Elena -> fog blue, Claude -> terracotta
  const userTone    = '#7E9BAB';
  const partnerTone = tk.accent; // terracotta in current accent
  const tone = post.who === 'user' ? userTone : partnerTone;
  const visibleComments = expanded ? post.comments : post.comments.slice(0, 1);

  return (
    <CCCard tk={tk} large style={{ paddingBottom: 16 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
        <CCAvatar tk={tk} name={post.name} size={36} tone={tone} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: tk.serif, fontSize: 15, fontWeight: 500,
            color: tk.text, letterSpacing: 0.1,
          }}>{post.name}</div>
          <div style={{
            fontFamily: tk.mono, fontSize: 10.5, color: tk.textMuted,
            letterSpacing: 0.3, opacity: 0.85, marginTop: 1,
          }}>{post.t}</div>
        </div>
        <button style={{
          width: 28, height: 28, border: 'none', background: 'transparent',
          color: tk.textMuted, cursor: 'pointer',
        }}><IconMore size={16} /></button>
      </div>

      {/* content */}
      <div style={{
        fontFamily: tk.sans, fontSize: 15, lineHeight: 1.6,
        color: tk.text, letterSpacing: 0.05,
        marginBottom: post.img ? 14 : 14,
        textWrap: 'pretty',
      }}>{post.text}</div>

      {post.img && (
        <div style={{ marginBottom: 14 }}>
          {post.imgIsDataURL ? (
            <img src={post.img} alt="" style={{
              display: 'block', width: '100%', maxHeight: 280, objectFit: 'cover',
              borderRadius: tk.radius.card,
            }} />
          ) : (
            <CCImagePlaceholder tk={tk} label={post.img} height={200} />
          )}
        </div>
      )}

      {/* actions */}
      <div style={{
        display: 'flex', gap: 14, alignItems: 'center',
        paddingBottom: post.comments.length > 0 ? 14 : 0,
        borderBottom: post.comments.length > 0 ? `0.5px solid ${tk.hairline}` : 'none',
        marginBottom: post.comments.length > 0 ? 14 : 0,
      }}>
        <button onClick={onHeart} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: post.hearted ? tk.accent : tk.textMuted,
          fontFamily: tk.sans, fontSize: 12, letterSpacing: 0.3,
          transition: `color ${tk.transition}`,
        }}>
          <IconHeartSmall size={16} fill={post.hearted ? tk.accent : 'none'} stroke={post.hearted ? tk.accent : tk.textMuted} />
          {post.hearted && <span>kept</span>}
        </button>
        <button onClick={onSave} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: post.saved ? tk.accent : tk.textMuted,
          fontFamily: tk.sans, fontSize: 12, letterSpacing: 0.3,
          transition: `color ${tk.transition}`,
        }}>
          <IconBookmark size={14} stroke={post.saved ? tk.accent : tk.textMuted}
            fill={post.saved ? tk.accent + '44' : 'none'} />
          {post.saved && <span>kept in museum</span>}
        </button>
      </div>

      {/* comments */}
      {visibleComments.map((c, i) => {
        const ctone = c.who === 'user' ? userTone : partnerTone;
        return (
          <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 10 }}>
            <CCAvatar tk={tk} name={c.name} size={24} tone={ctone} />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2,
              }}>
                <div style={{
                  fontFamily: tk.serif, fontSize: 12.5, fontWeight: 500,
                  color: tk.text,
                }}>{c.name}</div>
                <div style={{
                  fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
                  letterSpacing: 0.3, opacity: 0.7,
                }}>{c.t}</div>
              </div>
              <div style={{
                fontFamily: tk.sans, fontSize: 13.5, lineHeight: 1.5,
                color: tk.text, letterSpacing: 0.05,
              }}>{c.text}</div>
            </div>
          </div>
        );
      })}

      {post.comments.length > 1 && !expanded && (
        <div onClick={() => setExpanded(true)} style={{
          fontFamily: tk.serif, fontStyle: 'italic',
          fontSize: 12.5, color: tk.textMuted, cursor: 'pointer',
          marginTop: 4, opacity: 0.8,
        }}>see {post.comments.length - 1} more →</div>
      )}

      {/* reply */}
      <div style={{
        marginTop: post.comments.length > 0 ? 12 : 0,
        display: 'flex', gap: 8, alignItems: 'center',
        background: tk.inputBg, borderRadius: tk.radius.pill,
        padding: '8px 14px',
      }}>
        <input
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onComment(reply); setReply(''); } }}
          placeholder="reply…"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: tk.sans, fontSize: 13, color: tk.text,
          }} />
        {reply.trim() && (
          <button onClick={() => { onComment(reply); setReply(''); }} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            color: tk.accent, fontFamily: tk.sans, fontSize: 12, fontWeight: 600,
          }}>send</button>
        )}
      </div>
    </CCCard>
  );
}

function ComposeModal({ tk, value, onChange, onSubmit, onClose }) {
  const [attached, setAttached] = React.useState(null);
  const fileRef = React.useRef(null);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAttached({ name: f.name, url: reader.result });
    reader.readAsDataURL(f);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.4)',
        animation: 'cc-fadein 200ms ease-out',
      }} />
      <div style={{
        position: 'absolute', left: 16, right: 16, top: '12%',
        background: tk.card, borderRadius: tk.radius.cardLg,
        boxShadow: tk.shadowLift,
        border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
        padding: 22, zIndex: 51,
        animation: 'cc-popin 240ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            fontFamily: tk.serif, fontSize: 17, fontWeight: 500, color: tk.text,
            letterSpacing: 0.2,
          }}>a new feeling</div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 14, border: 'none',
            background: tk.inputBg, color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconClose size={12} /></button>
        </div>
        <textarea
          autoFocus
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="say what you noticed…"
          rows={4}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', fontFamily: tk.serif, fontSize: 16, lineHeight: 1.55,
            color: tk.text, letterSpacing: 0.1, marginBottom: 12,
          }} />

        {attached && (
          <div style={{
            position: 'relative', marginBottom: 14,
            borderRadius: tk.radius.card, overflow: 'hidden',
            border: `0.5px solid ${tk.hairline}`,
          }}>
            <img src={attached.url} alt="" style={{
              display: 'block', width: '100%', maxHeight: 200, objectFit: 'cover',
            }} />
            <button onClick={() => setAttached(null)} style={{
              position: 'absolute', top: 8, right: 8,
              width: 26, height: 26, borderRadius: 13, border: 'none',
              background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}><IconClose size={11} stroke="#fff" /></button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: tk.inputBg, color: tk.textMuted,
            border: 'none', padding: '8px 12px', borderRadius: tk.radius.pill,
            fontFamily: tk.sans, fontSize: 12, letterSpacing: 0.3, cursor: 'pointer',
            transition: `all ${tk.transition}`,
          }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hairline}
          onMouseLeave={e => e.currentTarget.style.background = tk.inputBg}
          >
            {/* image icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tk.textMuted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <circle cx="9" cy="10" r="1.5"/>
              <path d="M21 17l-5-5-9 8"/>
            </svg>
            {attached ? 'replace' : 'add image'}
          </button>
          <CCPill tk={tk} onClick={() => onSubmit(attached)} size="md">post</CCPill>
        </div>
      </div>
      <style>{`
        @keyframes cc-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cc-popin {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

window.Feel = Feel;

// — Calendar (heatmap) —
// Shows the active month, with each day cell tinted by how many feels were posted.
// Today is highlighted with a ring. Nav arrows move ±1 month; "today" 按钮回到当月.
function FeelCalendar({ tk, counts, onClose }) {
  const today = new Date(2026, 4, 26); // May 26, 2026 — fixed prototype "today"
  const [view, setView] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startWeekday = first.getDay(); // 0 = Sunday
  const daysInMonth = last.getDate();

  // Build a 6-week grid (42 cells) starting Sunday
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null); // pad to 6 rows

  const key = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isToday = (d) => d && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();

  // Heatmap opacity: 0 / 1 / 2-3 / 4-5 / 6+
  const heatLevel = (n) => {
    if (!n) return 0;
    if (n === 1) return 1;
    if (n <= 3) return 2;
    if (n <= 5) return 3;
    return 4;
  };
  const heatAlpha = [0, 0.18, 0.38, 0.62, 0.85];

  // Total feels in this month
  const monthTotal = Object.entries(counts)
    .filter(([k]) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .reduce((sum, [, v]) => sum + v, 0);

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60,
        animation: 'cc-fadein 200ms ease-out',
      }} />
      <div style={{
        position: 'absolute', left: 16, right: 16, top: '12%', zIndex: 61,
        background: tk.card, borderRadius: tk.radius.cardLg,
        boxShadow: tk.shadowLift,
        border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
        padding: 22,
        animation: 'cc-popin 240ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <button onClick={() => setView(new Date(year, month - 1, 1))} style={{
            width: 30, height: 30, borderRadius: 15, border: 'none',
            background: 'transparent', color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ transform: 'rotate(180deg)' }}>
              <IconChevronRight size={14} stroke={tk.textMuted} />
            </span>
          </button>
          <div style={{
            fontFamily: tk.serif, fontSize: 18, fontWeight: 500,
            color: tk.text, letterSpacing: 0.3,
          }}>{year} · {String(month + 1).padStart(2, '0')}</div>
          <button onClick={() => setView(new Date(year, month + 1, 1))} style={{
            width: 30, height: 30, borderRadius: 15, border: 'none',
            background: 'transparent', color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconChevronRight size={14} stroke={tk.textMuted} /></button>
        </div>

        {/* Weekday header */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: 8,
        }}>
          {weekdays.map(w => (
            <div key={w} style={{
              textAlign: 'center',
              fontFamily: tk.sans, fontSize: 10, color: tk.textMuted,
              letterSpacing: 0.6, fontWeight: 500,
            }}>{w}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}>
          {cells.map((d, i) => {
            const n = d ? (counts[key(d)] || 0) : 0;
            const lvl = heatLevel(n);
            const alpha = heatAlpha[lvl];
            const dayIsToday = isToday(d);
            return (
              <div key={i} style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {d && (
                  <>
                    <div style={{
                      position: 'absolute', inset: 4,
                      borderRadius: '50%',
                      background: alpha > 0 ? `rgba(184, 92, 58, ${alpha})` : 'transparent',
                      transition: `background ${tk.transition}`,
                    }} />
                    {dayIsToday && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: `1.25px solid ${tk.accent}`,
                      }} />
                    )}
                    <div style={{
                      position: 'relative', zIndex: 1,
                      fontFamily: tk.mono, fontSize: 11,
                      color: alpha > 0.5 ? '#fff' : tk.text,
                      letterSpacing: 0.2,
                      fontWeight: dayIsToday ? 600 : 400,
                    }}>{d}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend + total */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 18, paddingTop: 14,
          borderTop: `0.5px solid ${tk.hairline}`,
        }}>
          <div style={{
            fontFamily: tk.sans, fontSize: 11, color: tk.textMuted,
            letterSpacing: 0.3, fontStyle: 'italic',
          }}>本月 <span style={{ color: tk.accent, fontFamily: tk.mono, fontWeight: 600 }}>{monthTotal}</span> 条 feel</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: tk.sans, fontSize: 10, color: tk.textMuted, marginRight: 4 }}>少</span>
            {[1, 2, 3, 4].map(lvl => (
              <div key={lvl} style={{
                width: 10, height: 10, borderRadius: 5,
                background: `rgba(184, 92, 58, ${heatAlpha[lvl]})`,
              }} />
            ))}
            <span style={{ fontFamily: tk.sans, fontSize: 10, color: tk.textMuted, marginLeft: 4 }}>多</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

window.FeelCalendar = FeelCalendar;
