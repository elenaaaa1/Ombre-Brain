// Cotton Candy — Line icons, 1.75 stroke, rounded caps. Warm not cold.
// All icons accept { size, color, strokeWidth }.

const Icon = ({ size = 22, stroke: c = 'currentColor', sw = 1.75, children, viewBox = '0 0 24 24', fill = 'none' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill}
    stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
);

// — Nav icons —
const IconHome = (p) => (
  <Icon {...p}>
    <path d="M4 11.5L12 4.5l8 7" />
    <path d="M6 10.5V19a1 1 0 001 1h3v-5h4v5h3a1 1 0 001-1v-8.5" />
  </Icon>
);
const IconChat = (p) => (
  <Icon {...p}>
    <path d="M5 5.5h14a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-7l-4 3.5v-3.5H5A1.5 1.5 0 013.5 15V7A1.5 1.5 0 015 5.5z" />
  </Icon>
);
const IconFeel = (p) => (
  // seed/heart hybrid — a small leaf-heart
  <Icon {...p}>
    <path d="M12 20s-7-4.2-7-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 017 3.5C19 15.8 12 20 12 20z" />
  </Icon>
);
const IconOurs = (p) => (
  // constellation — three small stars connected
  <Icon {...p}>
    <circle cx="6" cy="7" r="1.2" fill={p?.stroke || 'currentColor'} />
    <circle cx="17" cy="6" r="1.2" fill={p?.stroke || 'currentColor'} />
    <circle cx="13" cy="14" r="1.2" fill={p?.stroke || 'currentColor'} />
    <circle cx="8" cy="18" r="1.2" fill={p?.stroke || 'currentColor'} />
    <path d="M6 7l11-1M17 6l-4 8M13 14l-5 4M8 18l-2-11" strokeOpacity="0.6" />
  </Icon>
);
const IconSettings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.6" />
    <path d="M19.4 13.5a7.6 7.6 0 000-3l1.6-1.2-1.8-3.1-1.9.6a7.6 7.6 0 00-2.6-1.5L14.4 3h-4.8l-.3 2.3a7.6 7.6 0 00-2.6 1.5l-1.9-.6L3 9.3l1.6 1.2a7.6 7.6 0 000 3L3 14.7l1.8 3.1 1.9-.6a7.6 7.6 0 002.6 1.5L9.6 21h4.8l.3-2.3a7.6 7.6 0 002.6-1.5l1.9.6 1.8-3.1-1.6-1.2z" />
  </Icon>
);

// — Action icons —
const IconArrowRight = (p) => (<Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>);
const IconPlus = (p) => (<Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>);
const IconPlusBubble = (p) => (
  <Icon {...p}>
    <path d="M5 5.5h14a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-7l-4 3.5v-3.5H5A1.5 1.5 0 013.5 15V7A1.5 1.5 0 015 5.5z" />
    <path d="M12 9v5M9.5 11.5h5" />
  </Icon>
);
const IconMenu = (p) => (<Icon {...p}><path d="M4 7h16M4 12h12M4 17h16" /></Icon>);
const IconSend = (p) => (<Icon {...p}><path d="M5 12l14-6.5-3 14-4-5-7-2.5z" /></Icon>);
const IconAttach = (p) => (<Icon {...p}><path d="M14 8l-6 6a2.5 2.5 0 003.5 3.5l7-7a4 4 0 00-5.6-5.6l-7.5 7.5a5.5 5.5 0 007.8 7.8l5.8-5.8" /></Icon>);
const IconCheck = (p) => (<Icon {...p}><path d="M5 12.5l4 4 10-10" /></Icon>);
const IconCircle = (p) => (<Icon {...p}><circle cx="12" cy="12" r="8" /></Icon>);
const IconChevronRight = (p) => (<Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>);
const IconChevronDown = (p) => (<Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>);
const IconPen = (p) => (<Icon {...p}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" /><path d="M14 6l3 3" /></Icon>);
const IconHeartSmall = (p) => (<Icon {...p}><path d="M12 18s-6-3.5-6-8a3.5 3.5 0 016-2.4A3.5 3.5 0 0118 10c0 4.5-6 8-6 8z" /></Icon>);
const IconBookmark = (p) => (<Icon {...p}><path d="M7 4h10v17l-5-3.5L7 21V4z" /></Icon>);
const IconSearch = (p) => (<Icon {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></Icon>);
const IconClose = (p) => (<Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>);
const IconMore = (p) => (<Icon {...p}><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/></Icon>);
const IconSun = (p) => (<Icon {...p}><circle cx="12" cy="12" r="3.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5L7 17M17 7l1.5-1.5" /></Icon>);
const IconMoon = (p) => (<Icon {...p}><path d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z" /></Icon>);

// — Room icons (Ours) —
const IconRoomMemory = (p) => (
  <Icon {...p}>
    {/* constellation/neural — a few connected dots */}
    <circle cx="7" cy="8" r="1.2" fill="currentColor" />
    <circle cx="14" cy="6" r="1.2" fill="currentColor" />
    <circle cx="18" cy="13" r="1.2" fill="currentColor" />
    <circle cx="11" cy="14" r="1.2" fill="currentColor" />
    <circle cx="6" cy="17" r="1.2" fill="currentColor" />
    <path d="M7 8l7-2 4 7-7 1-5 3-2-9z" strokeOpacity="0.5" />
  </Icon>
);
const IconRoomStudy = (p) => (
  <Icon {...p}>
    {/* open book */}
    <path d="M4 6.5l8-2 8 2v12l-8-2-8 2v-12z" />
    <path d="M12 4.5v14" />
  </Icon>
);
const IconRoomDiary = (p) => (
  <Icon {...p}>
    <path d="M6 4h11a2 2 0 012 2v14H8a2 2 0 01-2-2V4z" />
    <path d="M9 8h7M9 11.5h5" />
    <path d="M6 4v14a2 2 0 002 2" />
  </Icon>
);
const IconRoomMuseum = (p) => (
  <Icon {...p}>
    {/* frame */}
    <rect x="4" y="4" width="16" height="16" rx="1.2" />
    <path d="M8 16l3-4 3 3 2-2 3 3" strokeOpacity="0.7" />
    <circle cx="9" cy="9" r="1.2" />
  </Icon>
);
const IconRoomWorkshop = (p) => (
  <Icon {...p}>
    {/* drafting triangle */}
    <path d="M4 19l8-14 8 14H4z" />
    <path d="M9 13h6" strokeOpacity="0.6" />
  </Icon>
);
const IconRoomSink = (p) => (
  <Icon {...p}>
    {/* water ripple / headphone curve */}
    <path d="M3 13a4 4 0 014-4 5 5 0 0110 0 4 4 0 014 4v3a2 2 0 01-2 2h-2v-5h4M3 13v3a2 2 0 002 2h2v-5H3" />
  </Icon>
);
const IconRoomLetter = (p) => (
  <Icon {...p}>
    {/* envelope with wax-seal dot */}
    <rect x="3" y="6" width="18" height="13" rx="1.5" />
    <path d="M3.5 7l8.5 7 8.5-7" strokeOpacity="0.7" />
    <circle cx="19" cy="6.5" r="1.4" fill="currentColor" strokeOpacity="0"/>
  </Icon>
);

Object.assign(window, {
  IconHome, IconChat, IconFeel, IconOurs, IconSettings,
  IconArrowRight, IconPlus, IconPlusBubble, IconMenu, IconSend, IconAttach,
  IconCheck, IconCircle, IconChevronRight, IconChevronDown, IconPen,
  IconHeartSmall, IconBookmark, IconSearch, IconClose, IconMore,
  IconSun, IconMoon,
  IconRoomMemory, IconRoomStudy, IconRoomDiary, IconRoomMuseum, IconRoomWorkshop, IconRoomSink, IconRoomLetter,
});
