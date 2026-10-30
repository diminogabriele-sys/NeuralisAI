---
name: pro-dev-designer
description: >
  Build production-grade tools, apps, and code with professional UI/UX design — the kind a senior full-stack engineer and product designer would ship. Use this skill whenever the user wants to: create a tool, app, dashboard, utility, calculator, form, widget, game, or any interactive code artifact with high design quality; build something that "looks and feels professional"; design UI that is clean, modern, and polished; write frontend or full-stack code that combines great engineering with great aesthetics. Trigger this even for casual requests like "make a todo app", "build a converter tool", "create a dashboard", "design a login page", "make it look good", or any time the user implies they want both working code AND beautiful design. Always apply this skill when the user wants developer tools, SaaS-style interfaces, admin panels, data visualizations, forms, or interactive utilities. If it involves building something the user will see and interact with — USE THIS SKILL.
---

# Pro Developer & Designer Skill

Build tools, apps, and interactive experiences that combine **engineering excellence** with **professional design craft** — the output a senior full-stack dev and product designer would be proud to ship.

---

## Phase 1: Understand Before Building

Before writing a single line of code, ask yourself:

1. **What is this for?** — The tool's purpose shapes every design decision.
2. **Who uses it?** — Developer? End user? Executive? Each needs a different UX register.
3. **What's the primary action?** — One clear CTA or workflow should dominate.
4. **What platform/framework?** — HTML/CSS/JS, React, Vue, CLI, API? Match to context.
5. **What's the "feel"?** — Minimal SaaS, data-dense dashboard, playful consumer app, brutalist utility?

If context is unclear, make a bold, well-reasoned assumption and note it. Don't ask more than one clarifying question.

---

## Phase 2: Design System First

Before writing component code, establish a **consistent design language**. Define it as CSS variables or a design tokens object.

### Color System
```css
:root {
  /* Primary brand — pick ONE strong hue, not a rainbow */
  --color-primary:     #0F62FE;  /* IBM Blue, or choose intentionally */
  --color-primary-hover: #0043CE;
  --color-accent:      #FF6B35;  /* Complementary pop color */

  /* Neutral scale — NOT just gray, add a subtle warm/cool tint */
  --color-bg:          #0A0A0F;  /* Near-black with tint */
  --color-surface:     #13131A;
  --color-surface-2:   #1C1C27;
  --color-border:      rgba(255,255,255,0.08);

  /* Semantic */
  --color-success:     #00C48C;
  --color-warning:     #FFB020;
  --color-error:       #FF4D4D;
  --color-text:        #F0F0F5;
  --color-text-muted:  #8888AA;
}
```

**DO NOT** use generic palettes. Choose a palette that fits the purpose:
- **Dev tools** → Dark theme, monospace accents, terminal greens or electric blues
- **SaaS dashboard** → Clean light/dark mode, data-friendly neutrals, one brand color
- **Consumer app** → Warmer palette, rounded corners, softer transitions
- **Design tool** → Neutral canvas with precise color chips
- **Data viz** → Dark canvas, vibrant sequential/diverging scales

### Typography Scale
```css
:root {
  --font-display: 'Syne', 'Clash Display', 'Space Grotesk', sans-serif;
  --font-body:    'Inter', 'DM Sans', 'Plus Jakarta Sans', sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', monospace;

  --text-xs:   0.75rem;   /* 12px — labels, captions */
  --text-sm:   0.875rem;  /* 14px — secondary body */
  --text-base: 1rem;      /* 16px — primary body */
  --text-lg:   1.125rem;  /* 18px — large body */
  --text-xl:   1.25rem;   /* 20px — subheadings */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  2rem;      /* 32px — section titles */
  --text-4xl:  2.5rem;    /* 40px — hero */
}
```

**NEVER** use Inter alone as the only font. Always pair display + body or body + mono.

### Spacing & Layout
```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(var(--color-primary-rgb), 0.3);
}
```

---

## Phase 3: Component Architecture

### Core Component Patterns

#### Buttons
```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--text-sm);
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;
}

/* Primary — one per screen */
.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 0 0 0 transparent;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

/* Ghost — secondary action */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.05);
}
```

#### Input Fields
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
}
.input::placeholder { color: var(--color-text-muted); }
```

#### Cards / Panels
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
  /* Subtle top edge highlight */
  background-image: linear-gradient(
    to bottom,
    rgba(255,255,255,0.03) 0%,
    transparent 40px
  );
}
```

---

## Phase 4: Layout Patterns

### Application Shell
```
┌─────────────────────────────────────────────┐
│  HEADER  — Logo + Nav + Actions              │  48–64px
├──────────┬──────────────────────────────────┤
│          │                                  │
│ SIDEBAR  │        MAIN CONTENT              │  flex-grow
│ 240px    │        (scrollable)              │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  STATUS BAR (optional)                      │  32px
└─────────────────────────────────────────────┘
```

### Dashboard Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

/* Stat cards at top */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}
```

### Tool / Utility Layout
```
┌────────────────────────────────────────────┐
│  TOOL HEADER  — Title + description         │
├────────────────┬───────────────────────────┤
│                │                           │
│  INPUT PANEL   │   OUTPUT / RESULT PANEL   │
│  (left/top)    │   (right/bottom)          │
│                │                           │
└────────────────┴───────────────────────────┘
```

---

## Phase 5: Animation & Motion

**Principle**: Motion should feel purposeful, not decorative.

### Entry Animations
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

/* Staggered children */
.card:nth-child(1) { animation: fadeUp 0.4s ease both 0ms; }
.card:nth-child(2) { animation: fadeUp 0.4s ease both 60ms; }
.card:nth-child(3) { animation: fadeUp 0.4s ease both 120ms; }
```

### Loading States
```css
@keyframes shimmer {
  to { background-position: 200% center; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--color-surface) 0%,
    var(--color-surface-2) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% auto;
  animation: shimmer 1.5s linear infinite;
  border-radius: var(--radius-md);
}
```

### Micro-interactions
- Buttons: `transform: translateY(-1px)` on hover + glow shadow
- Links: Underline slides from left (clip-path trick)
- Input focus: Glow ring + border color shift
- Toggles: Spring-like cubic-bezier transitions
- Icons: Scale 1.1x on hover

---

## Phase 6: Code Quality Standards

### JavaScript / TypeScript

```javascript
// ✅ DO: Descriptive names, pure functions, error handling
async function fetchUserData(userId) {
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[fetchUserData]', err);
    return null;
  }
}

// ✅ DO: State management — simple, predictable
const state = {
  isLoading: false,
  data: null,
  error: null
};

// ✅ DO: Event delegation over per-element listeners for lists
document.querySelector('.list').addEventListener('click', e => {
  const item = e.target.closest('[data-item-id]');
  if (item) handleItemClick(item.dataset.itemId);
});
```

### React Patterns
```jsx
// ✅ Clean component structure
function ToolCard({ title, description, icon: Icon, onRun }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    await onRun();
    setIsRunning(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <Icon size={20} />
        <h3>{title}</h3>
      </div>
      <p className="text-muted">{description}</p>
      <button
        className={`btn-primary ${isRunning ? 'loading' : ''}`}
        onClick={handleRun}
        disabled={isRunning}
      >
        {isRunning ? 'Running…' : 'Run'}
      </button>
    </div>
  );
}
```

### Accessibility Checklist
- [ ] All interactive elements keyboard-navigable (`tabIndex`, `onKeyDown`)
- [ ] Buttons use `<button>`, links use `<a href>`
- [ ] Images have `alt` text
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- [ ] Focus states visible and distinct
- [ ] Form inputs have labels (visible or `aria-label`)
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Loading states announced via `aria-live`

---

## Phase 7: Tool-Specific Patterns

Read the relevant reference file for the tool type being built:

| Tool Type | Read |
|-----------|------|
| Dashboard / Analytics | `references/dashboard.md` |
| Form / Input Tool | `references/forms.md` |
| Data Table / List | `references/data-tables.md` |
| Code Editor / Dev Tool | `references/devtools.md` |
| Converter / Calculator | `references/utility-tools.md` |
| Landing Page / Marketing | `references/landing-pages.md` |

---

## Phase 8: Final Polish Checklist

Before delivering any UI/code, verify:

**Design**
- [ ] Consistent spacing (using scale, not arbitrary px values)
- [ ] No more than 2–3 font sizes per section
- [ ] Color contrast passes accessibility
- [ ] Hover/focus/active states on every interactive element
- [ ] Empty states designed (no blank panels)
- [ ] Loading states designed (skeleton or spinner)
- [ ] Error states designed (not just console.error)
- [ ] Mobile responsive or intentionally desktop-only (stated clearly)

**Code**
- [ ] No hardcoded magic numbers — use variables
- [ ] Functions ≤ 30 lines, single responsibility
- [ ] Event listeners cleaned up (if applicable)
- [ ] No console.log in delivered code
- [ ] Props/params validated
- [ ] Async operations have loading + error handling

**UX**
- [ ] Primary action immediately visible
- [ ] Feedback on every user action (click, submit, error)
- [ ] No layout shift during loading
- [ ] Keyboard navigation works
- [ ] Copy is clear, no lorem ipsum

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do instead |
|----------|--------------|
| Generic purple gradients | Purposeful, context-matched color |
| Inter as the only font | Pair display + body fonts |
| Unstyled default scrollbars | Custom scrollbar styling |
| Inline styles everywhere | CSS variables + classes |
| Alert() for errors | Inline toast/banner messages |
| Giant monolithic component | Decomposed, reusable pieces |
| No loading state | Skeleton or spinner always |
| Pixel-perfect rigidity | Responsive, fluid layouts |
| Overanimated everything | Purposeful motion only |
| Default blue links | Styled, on-brand interactive text |

---

## Quick Reference: Google Fonts Pairings (Load via @import)

```css
/* Option A: Sharp + Technical */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

/* Option B: Elegant + Editorial */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

/* Option C: Geometric + Modern */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

/* Option D: Humanist + Approachable */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap');
```

---

## Delivery Format

Always deliver:
1. **Working, runnable code** — Not pseudocode or skeletons
2. **All styles included** — No external CSS files unless specified
3. **Comments on non-obvious logic** — Not every line, just the clever/tricky parts
4. **Brief design rationale** — 2–3 sentences explaining key choices, so the user understands the decisions
