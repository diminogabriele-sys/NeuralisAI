# Utility Tools & Converters Reference

## Core Pattern: Input → Process → Output

```
┌──────────────────────────────────────────────────┐
│  TOOL HEADER                                     │
│  Title  ·  Brief description                     │
├──────────────────┬───────────────────────────────┤
│                  │                               │
│   INPUT AREA     │   OUTPUT AREA                 │
│                  │                               │
│  [textarea /     │  [result display /            │
│   dropzone /     │   code block /                │
│   form fields]   │   preview]                    │
│                  │                               │
│  [Convert →]     │  [Copy] [Download]            │
│                  │                               │
└──────────────────┴───────────────────────────────┘
│  OPTIONS / SETTINGS (collapsible)                │
└──────────────────────────────────────────────────┘
```

## Split-Panel Layout

```css
.tool-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  min-height: 400px;
}
@media (max-width: 768px) {
  .tool-wrapper { grid-template-columns: 1fr; }
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.panel-label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.panel-body {
  flex: 1;
  padding: var(--space-4);
  position: relative;
}
```

## Code Output Block

```css
.code-output {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: #A8FF78; /* terminal green — adjust to theme */
  min-height: 200px;
  max-height: 400px;
}
```

## Copy Button Pattern

```javascript
async function copyToClipboard(text, btn) {
  await navigator.clipboard.writeText(text);
  const original = btn.textContent;
  btn.textContent = '✓ Copied!';
  btn.classList.add('success');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('success');
  }, 2000);
}
```

## File Drop Zone

```html
<div class="dropzone" id="dropzone">
  <div class="dropzone-content">
    <svg><!-- upload icon --></svg>
    <p>Drop file here or <span class="link">browse</span></p>
    <p class="text-muted text-sm">Supports: .json, .csv, .txt</p>
  </div>
  <input type="file" id="fileInput" hidden accept=".json,.csv,.txt">
</div>
```

```css
.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-12);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.05);
}
```

## Real-time Processing

Always update output as user types for instant tools:
```javascript
let debounceTimer;
inputEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    processAndRender(inputEl.value);
  }, 150); // 150ms debounce for performance
});
```

## Progress Indicator for Slow Operations

```css
.progress-bar {
  height: 3px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}
/* Indeterminate (unknown duration) */
.progress-fill.indeterminate {
  width: 40%;
  animation: slide 1.5s ease-in-out infinite;
}
@keyframes slide {
  from { transform: translateX(-250%); }
  to   { transform: translateX(400%); }
}
```

## Calculator-Style Tools

```css
.calc-display {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  font-weight: 700;
  text-align: right;
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}

.calc-btn {
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: 600;
  transition: all 0.1s ease;
  cursor: pointer;
  border: none;
}
.calc-btn:active { transform: scale(0.94); }
```
