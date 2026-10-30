# Forms & Input UI Reference

## Form Layout Principles

1. **Single column** for mobile and simple forms (< 6 fields)
2. **Two column** for dense forms with related field pairs
3. **Multi-step** for complex flows (onboarding, checkout, wizards)
4. **Inline** for search, filter bars, quick-entry

## Field Anatomy

```
[Label]             ← 12-14px, medium weight, color-text-muted
[Prefix] [Input] [Suffix]  ← 14-16px body, full border
[Helper text / Error]  ← 12px, muted or error color
```

## Complete Form Component CSS

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.form-label .required {
  color: var(--color-error);
  font-size: var(--text-xs);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px var(--space-4);
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  -webkit-appearance: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.12);
}

.form-input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.12);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-helper {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.form-error {
  font-size: var(--text-xs);
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: 4px;
}
```

## Input with Icon / Prefix

```html
<div class="input-wrapper">
  <span class="input-prefix">
    <svg><!-- search icon --></svg>
  </span>
  <input class="form-input padded-left" placeholder="Search...">
</div>
```

```css
.input-wrapper {
  position: relative;
}
.input-prefix, .input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}
.input-prefix { left: var(--space-3); }
.input-suffix { right: var(--space-3); }
.padded-left  { padding-left: 36px; }
.padded-right { padding-right: 36px; }
```

## Toggle / Checkbox Styles

```css
.toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}
.toggle-track {
  width: 44px;
  height: 24px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  position: relative;
  transition: background 0.2s ease;
}
.toggle-track.active { background: var(--color-primary); }
.toggle-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.toggle-track.active .toggle-thumb { transform: translateX(20px); }
```

## Multi-Step Form / Wizard

```html
<div class="wizard">
  <!-- Step indicator -->
  <div class="steps">
    <div class="step completed">
      <div class="step-dot">✓</div>
      <span>Account</span>
    </div>
    <div class="step-connector"></div>
    <div class="step active">
      <div class="step-dot">2</div>
      <span>Details</span>
    </div>
    <div class="step-connector"></div>
    <div class="step">
      <div class="step-dot">3</div>
      <span>Confirm</span>
    </div>
  </div>

  <!-- Step content (animate between) -->
  <div class="step-content">
    <!-- Current step fields -->
  </div>

  <!-- Navigation -->
  <div class="wizard-nav">
    <button class="btn-ghost">← Back</button>
    <button class="btn-primary">Continue →</button>
  </div>
</div>
```

## Form Validation Pattern

```javascript
const validators = {
  required: (v) => v.trim() !== '' || 'This field is required',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email address',
  minLength: (n) => (v) => v.length >= n || `Minimum ${n} characters`,
  maxLength: (n) => (v) => v.length <= n || `Maximum ${n} characters`,
};

function validateField(value, rules) {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) return result; // return error message
  }
  return null; // valid
}

// Show inline error
function showError(field, message) {
  field.classList.add('error');
  const errEl = field.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = message;
}
```

## Submit Button States

```css
.btn-submit {
  min-width: 160px;
  position: relative;
  overflow: hidden;
}
.btn-submit.loading {
  pointer-events: none;
  opacity: 0.8;
}
.btn-submit.loading::after {
  content: '';
  position: absolute;
  right: var(--space-4);
  top: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
```
