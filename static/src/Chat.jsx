// Cotton Candy — Chat
// Top bar: hamburger | model | + bubble
// Sidebar slides in from left
// Message area: user bubble (right) + AI plain text (left) with Thought Process toggle
// Input area: terracotta send

function Chat({ tk, onOpenSidebar, sidebarOpen, onCloseSidebar, pendingAttachment, onClearAttachment }) {
  const D = window.DATA;
  const [log, setLog] = React.useState(D.chatLog);
  const [draft, setDraft] = React.useState('');
  const [expandedThoughts, setExpandedThoughts] = React.useState({});
  const [modelMenu, setModelMenu] = React.useState(false);
  const [model, setModel] = React.useState('Opus 4.6');
  const [composeMenu, setComposeMenu] = React.useState(false);
  const [editingIdx, setEditingIdx] = React.useState(null);
  const [savedAI, setSavedAI] = React.useState({});
  const [copiedAI, setCopiedAI] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log]);

  const send = () => {
    if (!draft.trim() && !pendingAttachment) return;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const userMsg = {
      who: 'user', t,
      text: draft.trim() || (pendingAttachment ? '这个。' : ''),
      attachment: pendingAttachment || undefined,
    };
    setLog([...log, userMsg]);
    setDraft('');
    if (pendingAttachment) onClearAttachment && onClearAttachment();

    // simulated AI reply — references the attachment if present
    const att = pendingAttachment;
    setTimeout(() => {
      const reply = att
        ? {
            who: 'ai', t,
            thought: `She brought in "${att.file ? att.file.title : att.subject?.name}" from ${att.subject?.name || 'Study'}. Don't lecture — ask what she wants out of it first.`,
            text: att.kind === 'study-subject'
              ? `看到了。${att.subject.name} 这个领域你现在想从哪里切入？`
              : `看到了《${att.file.title}》。你是想讨论某一段，还是先让我读一遍说我看到什么？`,
          }
        : {
            who: 'ai', t,
            thought: 'Briefly mirroring tone. The user is settling in — keep the reply light.',
            text: 'mm. 告诉我多一点——我在。',
          };
      setLog((cur) => [...cur, reply]);
    }, 900);
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: tk.bg, display: 'flex', flexDirection: 'column',
      paddingTop: 54,
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 18px 14px', position: 'relative',
      }}>
        <button onClick={onOpenSidebar} style={{
          width: 36, height: 36, borderRadius: 18,
          background: tk.inputBg, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tk.textMuted, cursor: 'pointer',
        }}><IconMenu size={18} /></button>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setModelMenu(!modelMenu)} style={{
            background: 'transparent', border: 'none',
            fontFamily: tk.serif, fontSize: 15, fontStyle: 'italic',
            color: tk.textMuted, letterSpacing: 0.3,
            display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
            padding: '6px 10px', borderRadius: 16,
          }}>
            {model}
            <IconChevronDown size={12} stroke={tk.textMuted} sw={1.5} />
          </button>
          {modelMenu && (
            <div style={{
              position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)',
              background: tk.card, borderRadius: tk.radius.card,
              boxShadow: tk.shadowLift,
              border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
              padding: 6, minWidth: 140, zIndex: 30,
            }}>
              {D.models.map(m => (
                <div key={m} onClick={() => { setModel(m); setModelMenu(false); }} style={{
                  padding: '10px 12px', borderRadius: 10,
                  fontFamily: tk.sans, fontSize: 13, color: tk.text,
                  background: m === model ? tk.inputBg : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  {m}
                  {m === model && <IconCheck size={14} stroke={tk.accent} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setComposeMenu(!composeMenu)} style={{
            width: 36, height: 36, borderRadius: 18,
            background: tk.inputBg, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tk.textMuted, cursor: 'pointer',
          }}><IconPlusBubble size={18} /></button>
          {composeMenu && (
            <div style={{
              position: 'absolute', top: '110%', right: 0,
              background: tk.card, borderRadius: tk.radius.card,
              boxShadow: tk.shadowLift,
              border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
              padding: 6, minWidth: 160, zIndex: 30,
            }}>
              {['New chat', 'Change session'].map(o => (
                <div key={o} onClick={() => { setComposeMenu(false); if (o === 'New chat') setLog([]); }}
                  style={{
                    padding: '10px 12px', borderRadius: 10,
                    fontFamily: tk.sans, fontSize: 13, color: tk.text,
                    cursor: 'pointer',
                  }}>{o}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message area */}
      <div ref={scrollRef} className="cc-scroll" style={{
        flex: 1, overflow: 'auto',
        padding: '8px 0 24px',
      }}>
        {log.length === 0 && (
          <div style={{
            padding: '60px 32px', textAlign: 'center',
            fontFamily: tk.serif, fontStyle: 'italic',
            color: tk.textMuted, fontSize: 16, lineHeight: 1.6,
          }}>a fresh page.<br/>say something, anything.</div>
        )}
        {log.map((m, i) => m.who === 'user'
          ? <UserMessage key={i} tk={tk} m={m}
              editing={editingIdx === i}
              onStartEdit={() => setEditingIdx(i)}
              onCancelEdit={() => setEditingIdx(null)}
              onSaveEdit={(newText) => {
                setLog(log.map((mm, ii) => ii === i ? { ...mm, text: newText, edited: true } : mm));
                setEditingIdx(null);
              }} />
          : <AIMessage key={i} tk={tk} m={m}
              expanded={!!expandedThoughts[i]}
              onToggle={() => setExpandedThoughts({ ...expandedThoughts, [i]: !expandedThoughts[i] })}
              saved={!!savedAI[i]}
              onSave={() => setSavedAI({ ...savedAI, [i]: !savedAI[i] })}
              copied={copiedAI === i}
              onCopy={() => {
                navigator.clipboard && navigator.clipboard.writeText(m.text);
                setCopiedAI(i);
                setTimeout(() => setCopiedAI((c) => c === i ? null : c), 1400);
              }} />
        )}
      </div>

      {/* Input area */}
      <ChatInput tk={tk} value={draft} onChange={setDraft} onSend={send}
        attachment={pendingAttachment} onClearAttachment={onClearAttachment} />

      {/* Sidebar */}
      <ChatSidebar tk={tk} open={sidebarOpen} onClose={onCloseSidebar} convos={D.conversations} />
    </div>
  );
}

function UserMessage({ tk, m, editing, onStartEdit, onCancelEdit, onSaveEdit }) {
  const [draft, setDraft] = React.useState(m.text);
  React.useEffect(() => setDraft(m.text), [m.text, editing]);

  if (editing) {
    return (
      <div style={{ padding: '8px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{
          background: tk.dark ? '#2D2D33' : '#EFE7DA',
          padding: '10px 14px',
          borderRadius: 20, borderTopRightRadius: 6,
          maxWidth: '85%', minWidth: 200,
        }}>
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={Math.min(6, Math.max(1, draft.split('\n').length))}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', color: tk.text,
              fontFamily: tk.sans, fontSize: 15, lineHeight: 1.5, letterSpacing: 0.05,
            }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6, marginRight: 4 }}>
          <button onClick={onCancelEdit} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: tk.textMuted, fontFamily: tk.sans, fontSize: 12, padding: '4px 10px',
            borderRadius: 12,
          }}>cancel</button>
          <button onClick={() => onSaveEdit(draft)} style={{
            background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: tk.sans, fontSize: 12, fontWeight: 600,
            padding: '4px 12px', borderRadius: 12,
          }}>save</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {m.attachment && <AttachmentChip tk={tk} attachment={m.attachment} compact />}
      <div style={{
        background: tk.dark ? '#2D2D33' : '#EFE7DA',
        color: tk.text,
        padding: '11px 16px',
        borderRadius: 20, borderTopRightRadius: 6,
        fontFamily: tk.sans, fontSize: 15, lineHeight: 1.5,
        maxWidth: '78%', letterSpacing: 0.05,
        textWrap: 'pretty',
      }}>{m.text}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 4, marginRight: 6,
      }}>
        <button onClick={onStartEdit} aria-label="edit" title="edit" style={{
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: tk.textMuted, opacity: 0.55,
          display: 'flex', alignItems: 'center',
          transition: `opacity ${tk.transition}`,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
        ><IconPen size={12} stroke={tk.textMuted} sw={1.6} /></button>
        <div style={{
          fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
          letterSpacing: 0.4, opacity: 0.7,
        }}>{m.t}{m.edited && <span style={{ fontStyle: 'italic', marginLeft: 4 }}>(edited)</span>}</div>
      </div>
    </div>
  );
}

// Small chip that previews an attachment (a Study file or subject) brought into chat.
// `compact` reduces padding when used inside a message bubble cluster.
function AttachmentChip({ tk, attachment, onClear, compact = false }) {
  if (!attachment) return null;
  const hue = attachment.subject?.hue || tk.accent;
  const isSubject = attachment.kind === 'study-subject';
  const title = isSubject ? attachment.subject.name : attachment.file?.title;
  const sub   = isSubject
    ? `— ${attachment.subject.files?.length || 0} files`
    : `${attachment.subject?.shortName || 'Study'} · ${attachment.file?.type?.toUpperCase() || ''}`;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: compact ? '6px 10px 6px 8px' : '8px 12px 8px 10px',
      background: tk.dark ? hue + '22' : hue + '14',
      border: `0.5px solid ${hue}55`,
      borderRadius: 12,
      marginBottom: compact ? 6 : 0,
      maxWidth: compact ? '78%' : '100%',
      minWidth: 0,
    }}>
      <div style={{
        width: 26, height: 32, borderRadius: 4,
        background: hue, flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 3,
        fontFamily: tk.mono, fontSize: 8, fontWeight: 600, color: '#fff',
        letterSpacing: 0.4, textTransform: 'uppercase',
      }}>{isSubject ? '···' : (attachment.file?.type || 'doc')}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: tk.serif, fontSize: 13, fontWeight: 500, color: tk.text,
          letterSpacing: 0.1, lineHeight: 1.25,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
        <div style={{
          fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
          letterSpacing: 0.3, opacity: 0.8, marginTop: 1,
        }}>{sub}</div>
      </div>
      {onClear && (
        <button onClick={onClear} aria-label="移除" style={{
          width: 22, height: 22, borderRadius: 11, border: 'none',
          background: 'transparent', color: tk.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, opacity: 0.65,
          transition: `opacity ${tk.transition}`,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.65}
        ><IconClose size={12} /></button>
      )}
    </div>
  );
}

function AIMessage({ tk, m, expanded, onToggle, saved, onSave, copied, onCopy }) {
  return (
    <div style={{ padding: '12px 20px 14px' }}>
      {m.thought && (
        <>
          <div onClick={onToggle} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: tk.sans, fontSize: 11, fontWeight: 500,
            color: tk.textMuted, letterSpacing: 0.6, textTransform: 'uppercase',
            cursor: 'pointer', marginBottom: 8,
            padding: '2px 0',
          }}>
            <IconChevronRight size={10} stroke={tk.textMuted} sw={2}
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: `transform ${tk.transition}` }} />
            Thought Process
          </div>
          {expanded && (
            <div style={{
              borderLeft: `1.5px solid ${tk.hairline}`,
              paddingLeft: 12, marginBottom: 12, marginLeft: 2,
              fontFamily: tk.serif, fontStyle: 'italic', fontSize: 13,
              color: tk.textMuted, lineHeight: 1.55,
              letterSpacing: 0.1,
            }}>{m.thought}</div>
          )}
        </>
      )}
      <div style={{
        fontFamily: tk.sans, fontSize: 15.5, lineHeight: 1.6,
        color: tk.text, letterSpacing: 0.05,
        textWrap: 'pretty',
      }}>{m.text}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginTop: 6,
      }}>
        <div style={{
          fontFamily: tk.mono, fontSize: 10, color: tk.textMuted,
          letterSpacing: 0.4, opacity: 0.7,
        }}>{m.t}</div>
        <button onClick={onSave} aria-label="save" title={saved ? 'saved' : 'save'} style={{
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: saved ? tk.accent : tk.textMuted, opacity: saved ? 1 : 0.55,
          display: 'flex', alignItems: 'center',
          transition: `all ${tk.transition}`,
        }}
        onMouseEnter={e => { if (!saved) e.currentTarget.style.opacity = 1; }}
        onMouseLeave={e => { if (!saved) e.currentTarget.style.opacity = 0.55; }}
        ><IconBookmark size={12} stroke={saved ? tk.accent : tk.textMuted} fill={saved ? tk.accent + '55' : 'none'} sw={1.6} /></button>
        <button onClick={onCopy} aria-label="copy" title="copy" style={{
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: tk.textMuted, opacity: 0.55,
          display: 'flex', alignItems: 'center', gap: 3,
          transition: `opacity ${tk.transition}`,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
        >
          {/* copy icon — two stacked rounded rects */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={tk.textMuted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="3" width="13" height="13" rx="2"/>
            <path d="M16 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h1"/>
          </svg>
          {copied && <span style={{ fontFamily: tk.sans, fontSize: 10, color: tk.accent, letterSpacing: 0.3 }}>copied</span>}
        </button>
      </div>
    </div>
  );
}

function ChatInput({ tk, value, onChange, onSend, attachment, onClearAttachment }) {
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 92,
      background: tk.card,
      borderRadius: attachment ? 22 : 28,
      boxShadow: tk.shadowSoft,
      border: tk.dark ? `0.5px solid ${tk.hairline}` : 'none',
      padding: attachment ? '8px 6px 6px' : 6,
      zIndex: 5,
      transition: `border-radius ${tk.transition}, padding ${tk.transition}`,
    }}>
      {attachment && (
        <div style={{ padding: '0 4px 8px' }}>
          <AttachmentChip tk={tk} attachment={attachment} onClear={onClearAttachment} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: 'transparent', color: tk.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}><IconPlus size={18} /></button>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={attachment ? 'ask about this…' : 'say something'}
          rows={1}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', padding: '10px 4px',
            fontFamily: tk.sans, fontSize: 14.5, color: tk.text,
            maxHeight: 96, lineHeight: 1.4,
          }}
        />
        <button onClick={onSend} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: (value.trim() || attachment) ? tk.accent : tk.inputBg,
          color: (value.trim() || attachment) ? '#fff' : tk.textMuted,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: `all ${tk.transition}`,
          flexShrink: 0,
        }}><IconSend size={16} stroke={(value.trim() || attachment) ? '#fff' : tk.textMuted} sw={2} /></button>
      </div>
    </div>
  );
}

function ChatSidebar({ tk, open, onClose, convos }) {
  return (
    <>
      {/* dim overlay */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: open ? 'rgba(0,0,0,0.35)' : 'transparent',
        pointerEvents: open ? 'auto' : 'none',
        transition: `background ${tk.transition}`,
      }} />
      {/* sidebar */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: '82%',
        background: tk.bg,
        boxShadow: tk.shadowLift,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: `transform 280ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
        zIndex: 41,
        display: 'flex', flexDirection: 'column',
        paddingTop: 60,
      }}>
        <div style={{ padding: '6px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: tk.serif, fontSize: 24, fontWeight: 500, color: tk.text,
            letterSpacing: 0.2,
          }}>Conversations</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16, border: 'none',
            background: tk.inputBg, color: tk.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconClose size={14} /></button>
        </div>
        {/* search */}
        <div style={{ padding: '0 22px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: tk.inputBg, borderRadius: 14, padding: '9px 12px',
            color: tk.textMuted,
          }}>
            <IconSearch size={14} />
            <input placeholder="search" style={{
              background: 'transparent', border: 'none', outline: 'none', flex: 1,
              fontFamily: tk.sans, fontSize: 13, color: tk.text,
            }} />
          </div>
        </div>
        {/* list */}
        <div className="cc-scroll" style={{ flex: 1, overflow: 'auto', padding: '4px 14px 28px' }}>
          {convos.map((c, i) => (
            <div key={c.id} style={{
              padding: '14px 10px',
              borderTop: i === 0 ? 'none' : `0.5px solid ${tk.hairline}`,
              cursor: 'pointer',
            }}>
              <div style={{
                fontFamily: tk.serif, fontSize: 15, fontWeight: 500,
                color: tk.text, marginBottom: 4, letterSpacing: 0.1,
                lineHeight: 1.3,
              }}>{c.title}</div>
              <div style={{
                fontFamily: tk.mono, fontSize: 11, color: tk.textMuted,
                letterSpacing: 0.3, opacity: 0.8,
              }}>{c.date}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

window.Chat = Chat;
