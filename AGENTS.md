# AGENTS.md

## Project Context

Veloce — Custom Moto Atelier: a static marketing site (Vite + React,
no backend, no auth). Treat it as user-owned application code, keep
changes focused on the user's request, and preserve existing project
conventions.

Start with `README.md` for local setup and available commands.

## Key Files

- `src/`: frontend application source.
- `src/pages/`: routed pages (`Home.jsx`, `About.jsx`).
- `src/components/site/`: homepage section components.
- `src/components/ui/`: shadcn/ui primitives.
- `vite.config.js`: Vite config.

## Working Notes

- Plain Vite app: `npm run dev` for local development, `npm run build`
  for a production build, no external services or accounts required.
- The contact form submits via a `mailto:` link — there is no backend
  function to call.
- Run the relevant checks from `package.json` (`lint`, `typecheck`,
  `build`) before finishing code changes.
