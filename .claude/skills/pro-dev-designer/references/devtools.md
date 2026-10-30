# Developer Tools UI Reference

## Dev Tool Aesthetic Principles

- **Dark by default** — terminal roots, eye comfort, code visibility
- **Monospace for data** — numbers, code, IDs, hashes
- **High information density** — devs read fast, less whitespace than consumer apps
- **Keyboard-first** — shortcuts, focus traps, Cmd+K palettes
- **Status always visible** — connection state, version, last updated

## Terminal / Console Style

```css
.terminal {
  background: #0D1117;
  border: 1px solid #30363D;
  border-radius: var(--radius-lg);
  font-family: var(--font-mono);
  font-size: 13px;
  overflow: hidden;
}

.terminal-titlebar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: #161B22;
  border-bottom: 1px solid #30363D;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red    { background: #FF5F57; }
.dot.yellow { background: #FEBC2E; }
.dot.green  { background: #28C840; }

.terminal-body {
  padding: var(--space-4);
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
}

/* Syntax tokens */
.tok-string  { color: #79C0FF; }
.tok-number  { color: #79C0FF; }
.tok-keyword { color: #FF7B72; }
.tok-comment { color: #8B949E; }
.tok-func    { color: #D2A8FF; }
.tok-success { color: #56D364; }
.tok-error   { color: #FF7B72; }
.tok-warning { color: #E3B341; }
.tok-path    { color: #A5D6FF; }
.tok-prompt  { color: #56D364; user-select: none; }
```

## Log Viewer

```html
<div class="log-viewer">
  <div class="log-toolbar">
    <input class="log-filter" placeholder="Filter logs…">
    <div class="log-level-filter">
      <button class="active" data-level="all">All</button>
      <button data-level="error">Error</button>
      <button data-level="warn">Warn</button>
      <button data-level="info">Info</button>
    </div>
    <button class="btn-ghost btn-sm" onclick="clearLogs()">Clear</button>
  </div>
  <div class="log-body" id="logBody">
    <!-- log entries append here -->
  </div>
</div>
```

```css
.log-entry {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: var(--space-3);
  padding: 4px var(--space-4);
  font-size: 12px;
  font-family: var(--font-mono);
  border-left: 2px solid transparent;
  transition: background 0.1s;
}
.log-entry:hover { background: rgba(255,255,255,0.03); }
.log-entry.error { border-left-color: var(--color-error); background: rgba(255,77,77,0.05); }
.log-entry.warn  { border-left-color: var(--color-warning); }
.log-entry.info  { border-left-color: var(--color-primary); }

.log-time { color: #8B949E; white-space: nowrap; }
.log-level {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.05em;
  width: 40px;
}
```

## JSON / Code Viewer

```css
.json-viewer {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  background: #0D1117;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  overflow: auto;
}
.json-key     { color: #79C0FF; }
.json-string  { color: #A5D6FF; }
.json-number  { color: #F8CC6B; }
.json-boolean { color: #FF7B72; }
.json-null    { color: #8B949E; }
.json-bracket { color: #8B949E; }
```

## Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.badge.online   { color: #56D364; background: rgba(86,211,100,0.15); }
.badge.offline  { color: #8B949E; background: rgba(139,148,158,0.15); }
.badge.error    { color: #FF7B72; background: rgba(255,123,114,0.15); }
.badge.pending  {
  color: #E3B341;
  background: rgba(227,179,65,0.15);
  animation: pulse-badge 2s ease-in-out infinite;
}
@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Keyboard Shortcut Display

```css
kbd {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-bottom-width: 2px;
  border-radius: 4px;
  color: var(--color-text-muted);
  box-shadow: 0 1px 0 var(--color-border);
}
```

## Command Palette (Cmd+K)

```css
.command-palette-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.command-palette {
  width: 540px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 64px rgba(0,0,0,0.7);
  overflow: hidden;
  animation: scaleIn 0.15s ease;
}

.command-input {
  width: 100%;
  padding: var(--space-4);
  font-size: var(--text-base);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  outline: none;
  font-family: var(--font-mono);
}

.command-results {
  max-height: 320px;
  overflow-y: auto;
}
.command-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: background 0.1s;
}
.command-item:hover,
.command-item.active { background: var(--color-surface-2); }
```
