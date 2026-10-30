# Dashboard & Analytics UI Reference

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR: Logo | Breadcrumb | Search | User Avatar   │
├────────────┬────────────────────────────────────────┤
│            │  PAGE HEADER: Title + Date Picker      │
│  SIDEBAR   ├────────────────────────────────────────┤
│  (nav)     │  STAT CARDS ROW (4 cols)               │
│            ├─────────────────┬──────────────────────┤
│  240px     │  MAIN CHART     │  SECONDARY CHART     │
│            │  (2/3 width)    │  (1/3 width)         │
│            ├─────────────────┴──────────────────────┤
│            │  DATA TABLE                            │
└────────────┴────────────────────────────────────────┘
```

## Stat Card Pattern

```html
<div class="stat-card">
  <div class="stat-header">
    <span class="stat-label">Total Revenue</span>
    <span class="stat-badge positive">+12.4%</span>
  </div>
  <div class="stat-value">$48,295</div>
  <div class="stat-sparkline"><!-- mini SVG chart --></div>
  <div class="stat-meta">vs $42,980 last month</div>
</div>
```

```css
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: border-color 0.2s ease;
}
.stat-card:hover { border-color: var(--color-primary); }

.stat-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  font-family: var(--font-display);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.stat-badge.positive { background: rgba(0, 196, 140, 0.15); color: #00C48C; }
.stat-badge.negative { background: rgba(255, 77, 77, 0.15); color: #FF4D4D; }
```

## Chart Color Palettes

```javascript
// Sequential (single metric over time)
const blueScale = ['#EFF6FF', '#BFDBFE', '#60A5FA', '#2563EB', '#1E3A8A'];

// Categorical (multiple series)
const categoricalPalette = [
  '#0F62FE', // primary blue
  '#00C48C', // green
  '#FF6B35', // orange
  '#A855F7', // purple
  '#FFB020', // yellow
  '#06B6D4', // cyan
];

// Diverging (positive/negative)
const divergingPalette = {
  positive: '#00C48C',
  neutral:  '#8888AA',
  negative: '#FF4D4D',
};
```

## Sidebar Navigation Pattern

```html
<nav class="sidebar">
  <div class="sidebar-logo">...</div>
  <div class="nav-section">
    <span class="nav-section-label">Overview</span>
    <a class="nav-item active" href="#">
      <svg><!-- icon --></svg>
      Dashboard
    </a>
    <a class="nav-item" href="#">
      <svg><!-- icon --></svg>
      Analytics
    </a>
  </div>
  <div class="nav-section">
    <span class="nav-section-label">Management</span>
    <!-- more items -->
  </div>
  <div class="sidebar-footer">
    <!-- user profile / settings -->
  </div>
</nav>
```

```css
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-6);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}
.nav-item:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}
.nav-item.active {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
}
```

## Date Range Picker Pattern

Always provide presets + custom range:
- Today / Yesterday
- Last 7 days / Last 30 days
- This Month / Last Month
- Custom range (date inputs)

## Data Table Pattern

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}
.data-table thead th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: 500;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background 0.1s ease;
}
.data-table tbody tr:hover {
  background: var(--color-surface-2);
}
.data-table tbody td {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text);
}
```
