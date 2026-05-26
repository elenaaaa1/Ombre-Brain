// Cotton Candy — Home page
// Zone A: greeting, last chat, reminder + to-do
// Zone B (below fold): "Heartbeat" — metrics + recent AI thoughts, open on page bg

function Home({ tk, onEnterChat, onSeeAllHeartbeat }) {
  const D = window.DATA;

  return (
    <div style={{ paddingTop: 64, paddingBottom: 140 }}>
      {/* greeting */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{
          fontFamily: tk.serif, fontSize: 22, fontWeight: 400, fontStyle: 'italic',
          color: tk.textMuted, letterSpacing: 0.3,
        }}>{D.greeting}</div>
      </div>

      {/* Last chat card */}
      <div style={{ padding: '0 18px 14px' }}>
        <CCCard tk={tk} onClick={onEnterChat} large style={{ paddingBottom: 18 }}>
          <div style={{
            fontFamily: tk.sans, fontSize: 11, fontWeight: 600,
            color: tk.textMuted, letterSpacing: 1.2, textTransform: 'uppercase',
            marginBottom: 10,
          }}>last chat</div>
          <div style={{
            fontFamily: tk.serif, fontSize: 22, fontWeight: 500,
            color: tk.text, lineHeight: 1.25, marginBottom: 8,
            letterSpacing: 0.1,
          }}>{D.lastChat.title}</div>
          <div style={{
            fontFamily: tk.sans, fontSize: 14,
            color: tk.textMuted, lineHeight: 1.55,
            marginBottom: 16,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{D.lastChat.snippet}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: tk.mono, fontSize: 11, color: tk.textMuted,
              letterSpacing: 0.3, opacity: 0.8,
            }}>{D.lastChat.timeAgo}</div>
            <CCPill tk={tk} variant="filled" icon={
              <IconArrowRight size={12} stroke="#fff" />
            }>continue</CCPill>
          </div>
        </CCCard>
      </div>

      {/* Reminder + To-do, side by side */}
      <div style={{
        padding: '0 18px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        <ReminderCard tk={tk} items={D.reminders} />
        <TodoCard tk={tk} items={D.todos} />
      </div>

      {/* Zone B: Heartbeat — open on page bg, no cards */}
      <div style={{ padding: '48px 24px 0' }}>
        <CCSectionLabel tk={tk}>heartbeat</CCSectionLabel>

        {/* Metrics 2x2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 22,
          marginBottom: 36,
        }}>
          {D.heartbeat.metrics.map((m, i) => (
            <div key={i}>
              <div style={{
                fontFamily: tk.sans, fontSize: 11, fontWeight: 500,
                color: tk.textMuted, letterSpacing: 0.8, textTransform: 'uppercase',
                marginBottom: 6,
              }}>{m.label}</div>
              <div style={{
                fontFamily: tk.mono, fontSize: 20, fontWeight: 500,
                color: tk.text, letterSpacing: 0.2,
              }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Recent thoughts stream */}
        <div style={{
          fontFamily: tk.serif, fontStyle: 'italic',
          fontSize: 13, color: tk.textMuted, letterSpacing: 0.4,
          marginBottom: 16, opacity: 0.7,
        }}>recent thoughts</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {D.heartbeat.thoughts.map((th, i) => (
            <div key={i} style={{
              paddingTop: 14, paddingBottom: 18,
              borderTop: i === 0 ? 'none' : `0.5px solid ${tk.hairline}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{
                  fontFamily: tk.mono, fontSize: 11, color: tk.textMuted,
                  letterSpacing: 0.4, opacity: 0.8,
                }}>{th.t}</div>
              </div>
              <div style={{
                fontFamily: tk.sans, fontSize: 14.5, lineHeight: 1.6,
                color: tk.text, letterSpacing: 0.05,
                textWrap: 'pretty',
              }}>{th.text}</div>
            </div>
          ))}
        </div>

        <div onClick={onSeeAllHeartbeat} style={{
          marginTop: 24, cursor: 'pointer',
          fontFamily: tk.serif, fontStyle: 'italic',
          fontSize: 14, color: tk.accent,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>see all <span style={{ fontFamily: tk.sans }}>→</span></div>
      </div>
    </div>
  );
}

function ReminderCard({ tk, items }) {
  return (
    <CCCard tk={tk} style={{ minHeight: 165 }}>
      <div style={{
        fontFamily: tk.serif, fontSize: 17, fontWeight: 500,
        color: tk.text, marginBottom: 12, letterSpacing: 0.2,
      }}>Reminder</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.slice(0, 3).map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
            <div style={{
              fontFamily: tk.mono, fontSize: 11, color: tk.accent,
              minWidth: 38, letterSpacing: 0.2, flexShrink: 0,
            }}>{r.time}</div>
            <div style={{
              fontFamily: tk.sans, fontSize: 13, color: tk.text,
              lineHeight: 1.4,
            }}>{r.text}</div>
          </div>
        ))}
      </div>
    </CCCard>
  );
}

function TodoCard({ tk, items: initial }) {
  const [items, setItems] = React.useState(initial);
  const toggle = (i) => setItems(items.map((it, idx) => idx === i ? { ...it, done: !it.done } : it));
  return (
    <CCCard tk={tk} style={{ minHeight: 165 }} onClick={undefined}>
      <div style={{
        fontFamily: tk.serif, fontSize: 17, fontWeight: 500,
        color: tk.text, marginBottom: 12, letterSpacing: 0.2,
      }}>To do</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.slice(0, 3).map((it, i) => (
          <div key={i}
            onClick={(e) => { e.stopPropagation(); toggle(i); }}
            style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
            <div style={{
              width: 16, height: 16, borderRadius: 8,
              border: `1.25px solid ${it.done ? tk.accent : tk.hairline}`,
              background: it.done ? tk.accent : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: `all ${tk.transition}`,
              flexShrink: 0,
            }}>
              {it.done && <IconCheck size={11} stroke="#fff" sw={2.5} />}
            </div>
            <div style={{
              fontFamily: tk.sans, fontSize: 13,
              color: it.done ? tk.textMuted : tk.text,
              textDecoration: it.done ? 'line-through' : 'none',
              opacity: it.done ? 0.6 : 1,
              transition: `all ${tk.transition}`,
              lineHeight: 1.4,
            }}>{it.text}</div>
          </div>
        ))}
      </div>
    </CCCard>
  );
}

window.Home = Home;
