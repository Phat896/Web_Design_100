# 🪐 StellarMind - Design System & Architecture

## 1. WIREFRAME & SECTION MAP

### Mercury (Loneliness / Cô Đơn) - EXAMPLE

```
┌─────────────────────────────────────────┐
│  VIEWPORT 100vh                         │
├─────────────────────────────────────────┤
│ SECTION 1: HERO LANDING                 │
│ - 3D Planet (center, animated)          │
│ - Planet name (fade up)                 │
│ - Emotion name (glow text)              │
│ - Tagline (typewriter effect)           │
│ - Scroll indicator (pulse)              │
├─────────────────────────────────────────┤
│ SECTION 2: SYMPTOMS (100vh)             │
│ Title: "Bạn có đang ở hành tinh này?"   │
│ Grid: 3x3 symptom cards (mobile: 1x1)   │
│ - Icon + text                           │
│ - Stagger animation on scroll           │
│ - Parallax background                   │
├─────────────────────────────────────────┤
│ SECTION 3: DEEP DIVE (100vh)            │
│ Title: "Bên Trong Hành Tinh"            │
│ - Hero image (left 50% desktop)         │
│ - Storytelling text (right 50%)         │
│ - Parallax effect                       │
│ - Scroll-triggered zoom                 │
├─────────────────────────────────────────┤
│ SECTION 4: STATISTICS (100vh)           │
│ Title: "Thống Kê"                       │
│ Grid layout:                            │
│ - Circular progress (animated counter)  │
│ - Progress bars                         │
│ - Number counters                       │
│ - Scroll-triggered animations           │
├─────────────────────────────────────────┤
│ SECTION 5: SOCIAL THOUGHTS (100vh)      │
│ Title: "Những Suy Nghĩ Thường Gặp"      │
│ - Social cards (quote style)            │
│ - Profile avatar                        │
│ - Horizontal scroll (desktop)           │
│ - Snap scroll cards (mobile)            │
│ - Fade in on scroll                     │
├─────────────────────────────────────────┤
│ SECTION 6: CAUSES (100vh)               │
│ Title: "Nguyên Nhân"                    │
│ - Timeline vertical                     │
│ - Connected dots                        │
│ - Animated on scroll                    │
│ - Icon + description cards              │
├─────────────────────────────────────────┤
│ SECTION 7: IMPACTS (100vh)              │
│ Title: "Tác Động"                       │
│ - 4-card grid (desktop)                 │
│ - Each card: icon, title, description   │
│ - Hover effects                         │
│ - Stagger animation                     │
├─────────────────────────────────────────┤
│ SECTION 8: ADVICE (100vh)               │
│ Title: "Lời Khuyên"                     │
│ - Interactive cards                     │
│ - Click to reveal details               │
│ - Card flip animation                   │
│ - Color-coded (gradient per advice)     │
├─────────────────────────────────────────┤
│ SECTION 9: VISUAL INSPIRATION (100vh)   │
│ Title: "Hãy Nhìn Khác Đi"               │
│ - Full width image / video              │
│ - Text overlay                          │
│ - Parallax scroll                       │
│ - Fade animations                       │
├─────────────────────────────────────────┤
│ SECTION 10: CTA CHECKLIST (100vh)       │
│ Title: "Hành Động Ngay Hôm Nay"         │
│ - Checklist items                       │
│ - Click to check (with animation)       │
│ - Progress bar                          │
│ - Share button                          │
├─────────────────────────────────────────┤
│ SECTION 11: AI CHAT (100vh)             │
│ Title: "Tìm Hiểu Thêm"                  │
│ - Chat interface                        │
│ - Bot greeting                          │
│ - Input field                           │
│ - Message bubbles (fade in)             │
├─────────────────────────────────────────┤
│ SECTION 12: PLANET EXPLORER (50vh)      │
│ Title: "Khám Phá Hành Tinh Khác"        │
│ - Carousel 8 planets                    │
│ - Click to go to planet page            │
│ - Horizontal scroll                     │
│ - Current planet highlighted            │
└─────────────────────────────────────────┘
```

---

## 2. PLANET THEMES & COLOR PALETTE

| Planet  | Emotion          | Primary Color      | Secondary | Background Accent | Icon | Vibe            |
| ------- | ---------------- | ------------------ | --------- | ----------------- | ---- | --------------- |
| Mercury | Cô Đơn           | `#94a3b8` (Gray)   | `#64748b` | Dust particles    | ❄️   | Cold, isolated  |
| Venus   | Ghen Tị          | `#f97316` (Orange) | `#ec4899` | Warm toxic glow   | 🔥   | Hot, possessive |
| Earth   | Lo Âu            | `#3b82f6` (Blue)   | `#10b981` | Storm clouds      | ⚡   | Turbulent       |
| Mars    | Giận Dữ          | `#ef4444` (Red)    | `#dc2626` | Lava flows        | 💥   | Explosive       |
| Jupiter | Áp Lực           | `#fbbf24` (Amber)  | `#f59e0b` | Swirling bands    | 🌪️   | Chaotic         |
| Saturn  | Trầm Cảm         | `#6366f1` (Indigo) | `#4f46e5` | Rings of sadness  | 😔   | Heavy           |
| Uranus  | Tự Ti            | `#06b6d4` (Cyan)   | `#0891b2` | Frozen aura       | ❓   | Questioning     |
| Neptune | Mất Phương Hướng | `#8b5cf6` (Violet) | `#6366f1` | Deep ocean        | 🌊   | Mysterious      |

---

## 3. UI COMPONENTS

### Reusable Components:

1. **Hero Section** - Planet + Title + Tagline
2. **Symptom Card** - Icon + Label + Hover glow
3. **Social Quote Card** - Quote text + Avatar + Username
4. **Timeline Node** - Icon + Title + Description + Connector
5. **Impact Grid Card** - Icon + Title + Long description
6. **Advice Card** - Flip card with front/back
7. **Chat Bubble** - Bot/User message with fade animation
8. **Planet Carousel Item** - Mini planet 3D + name + link
9. **CTA Checkbox** - Animated checkbox + text
10. **Progress Indicator** - Circular + linear options

---

## 4. ANIMATION STRATEGY

### GSAP + ScrollTrigger Usage:

```javascript
// Animations Map:
{
  "hero": {
    "planet": "scale in + floating",
    "title": "fade up + text shadow glow",
    "tagline": "typewriter effect"
  },
  "symptoms": {
    "cards": "stagger fade up on scroll",
    "background": "parallax (-5% to +5%)",
    "hover": "card scale + glow"
  },
  "statistics": {
    "numbers": "counter animation 0 → final number",
    "bars": "bar fill animation",
    "circles": "circular progress stroke",
    "trigger": "start when section enters viewport"
  },
  "timeline": {
    "lines": "draw SVG line on scroll",
    "dots": "pulse animation",
    "text": "fade in sequence"
  },
  "advice": {
    "cards": "flip 3D on click",
    "stagger": "0.1s between each"
  },
  "carousel": {
    "scroll": "smooth horizontal snap",
    "items": "scale on center"
  }
}
```

### Key GSAP Plugins:

- `gsap.to()` / `gsap.from()` - Basic tweens
- `ScrollTrigger` - Scroll-based animations
- `gsap.timeline()` - Complex sequences
- `gsap.utils.toArray()` - Batch animations
- `Flip` plugin - State-based animations (for card flips)

---

## 5. HTML ARCHITECTURE

### File Structure:

```
frontend/
├── html/
│   ├── mercury.html          (NEW - Mẫu)
│   ├── venus.html
│   ├── earth.html
│   ├── ...
│   └── index.html
├── css/
│   ├── design-system.css     (NEW - Global design tokens)
│   ├── planet-new.css        (NEW - Planet pages)
│   ├── components.css        (NEW - Reusable components)
│   └── animations.css        (NEW - GSAP animations prep)
├── js/
│   ├── planet-app.js         (NEW - Main app controller)
│   ├── animations.js         (NEW - GSAP setup)
│   ├── utils.js              (NEW - Helpers)
│   └── planet-page.js        (OLD - Keep for fallback)
└── assets/
    ├── images/planets/
    ├── images/icons/
    └── models/              (Optional: 3D models)
```

---

## 6. CSS ARCHITECTURE

### Design Tokens (CSS Variables):

```css
:root {
  /* COLORS - 8 planets */
  --color-mercury-primary: #94a3b8;
  --color-venus-primary: #f97316;
  --color-earth-primary: #3b82f6;
  /* ... etc */

  /* TYPOGRAPHY */
  --font-display: "Outfit", sans-serif; /* Headings */
  --font-body: "Inter", sans-serif; /* Body */
  --font-mono: "JetBrains Mono", mono; /* Data */

  /* SPACING */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* SHADOWS */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px var(--color-primary, #00d4ff);

  /* ANIMATIONS */
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

body[data-planet="mercury"] {
  --color-primary: var(--color-mercury-primary);
  --color-secondary: #64748b;
  --bg-accent: radial-gradient(...);
}
```

---

## 7. RESPONSIVE BREAKPOINTS

```css
/* Mobile-first */
/* Default: < 640px (1 column) */

@media (min-width: 768px) {
  /* Tablet: 768px - 1024px (2 columns) */
}

@media (min-width: 1024px) {
  /* Desktop: > 1024px (3-4 columns) */
}

@media (min-width: 1440px) {
  /* Large desktop: 4+ columns */
}
```

---

## 8. PERFORMANCE CHECKLIST

- [ ] Lazy load images (Intersection Observer)
- [ ] WEBP format for images
- [ ] Defer GSAP animations until user scrolls
- [ ] CSS containment for expensive elements
- [ ] Minimize repaints (use `transform` instead of `left/top`)
- [ ] Use `will-change` sparingly
- [ ] Preload fonts
- [ ] Optimize animations for 60fps

---

## 9. ACCESSIBILITY CHECKLIST

- [ ] Semantic HTML (section, article, aside, nav)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Focus states visible
- [ ] Color contrast ≥ 4.5:1
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Alt text for images
- [ ] Form labels associated with inputs

---

## 10. SEO CHECKLIST

- [ ] Meta tags (title, description, og:\*)
- [ ] Structured data (JSON-LD)
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for images
- [ ] Fast load time
- [ ] Mobile responsive
- [ ] Open Graph tags for social sharing
