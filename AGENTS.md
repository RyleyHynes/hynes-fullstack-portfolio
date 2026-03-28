# AGENTS.md

These instructions apply to Codex edits in this repository.

## Frontend Component Reuse

- Prefer existing reusable component shells in `frontend/src/components` before creating new markup.
- Reuse existing primitives first (for example: buttons, cards, form controls, layout wrappers, modals, and data-display components).
- If a reusable component exists and can be extended safely, update that component instead of duplicating UI patterns inline.
- Avoid replacing existing reusable components with ad hoc JSX unless explicitly requested.

## React imports and JSX Prop Ordering

- Avoid global React namespace imports like `import React from 'react'` where specific named exports are available.
- Import hooks explicitly, e.g. `import { useEffect, useMemo } from 'react'`.
- In JSX elements, order non-callback props alphabetically by prop name.
- Keep callback props grouped at the bottom of the prop list.
- Callback props are function/event props such as: `onClick`, `onChange`, `onSubmit`, `onClose`, `onSelect`, and similar `on*` props.
- Within the callback group, keep callback props alphabetized.

## ES6 Component Style

- Follow ES6+ syntax conventions for frontend code.
- Prefer arrow function components over function declarations for default-exported React components.
- Define the component first, then place `export default <ComponentName>` at the bottom of the file.
- Do not use inline default-export function declarations like `export default function Component() { ... }` unless explicitly requested.

## Example Ordering

```tsx
<Button
  ariaLabel="Toggle dark mode"
  className="btn-ghost"
  disabled={isLoading}
  size="sm"
  variant="ghost"
  onBlur={handleBlur}
  onClick={handleClick}
/>
```
