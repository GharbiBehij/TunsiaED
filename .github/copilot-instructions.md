<!-- Repo-specific Copilot instructions for AI coding agents -->
# Copilot Instructions — TunisiaED (concise)

This file gives AI coding agents the minimum, actionable knowledge to be productive in this repository.

- **Big picture architecture:**
  - **Backend (BFF):** `bff/` is an Express.js BFF that exposes REST endpoints under `/api/v1/*` (see `bff/app.js`). It follows a domain-first layout: `Modules/<Domain>/{api,model,repository,service}`.
  - **Web frontend:** `web/e-platform-web/` is a React app created with `react-scripts`. It uses `react-router`, `@tanstack/react-query`, and an `AuthProvider` + `ProtectedRoute` pattern (`web/src/App.jsx`).
  - **Mobile:** `mobile/e_platform_mobile/` is a Flutter app. It initializes Firebase (`lib/main.dart`) and uses a `Makefile` for common dev commands (run, build, run-dev with `--dart-define=BFF_URL=...`).

- **How services communicate:**
  - Web and Mobile call the BFF REST API (default BFF port `3001`). Mobile uses `--dart-define=BFF_URL` for environment switching (`Makefile` targets `run-dev`/`run-prod`).
  - BFF uses Firebase Admin SDK for auth and Firestore (`bff/src/config/firebase.js`). Local dev falls back to `firebase-credentials.json` at repo root (relative path: `bff/../../firebase-credentials.json`).

- **Key developer commands**
  - BFF: `cd bff && npm install` then `npm run dev` (uses `nodemon`) or `npm start` for production.
  - Web: `cd web/e-platform-web && npm install` then `npm run dev` or `npm start`; build with `npm run build`; deploy hosting via `npm run deploy` (wraps `firebase-tools`).
  - Mobile: `cd mobile/e_platform_mobile && make install` then `make run` or `make run-dev` (sets `BFF_URL` for dev).

- **Environments & secrets**
  - BFF prefers env vars: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. If absent it expects `firebase-credentials.json` for local dev (see `bff/src/config/firebase.js`).
  - The Flutter app reads `BFF_URL` via `--dart-define`; web config is in `web/src/firebase.js` and `web/.env` if present.

- **Project conventions & patterns**
  - Domain modules: each domain under `bff/src/Modules/<Domain>/` keeps `api`, `model`, `repository`, `service` folders. Mimic this structure for new domains.
  - Routes: BFF mounts routers in `bff/app.js` under `/api/v1/<domain>` — prefer adding a new router and registering it in `app.js`.
  - Auth: BFF uses Firebase Admin auth (`auth` exported from `bff/src/config/firebase.js`) and middleware in `bff/src/middlewares`. Check `auth.middleware.js` and `Role.middleware.js` for patterns.
  - Error handling: single global error handler and a 404 handler are at the bottom of `bff/app.js` — throw errors with `.status` to control HTTP response codes.
  - Frontend: use `@tanstack/react-query` and `queryClient` from `web/src/lib/queryClient`; follow `AuthProvider` and `ProtectedRoute` usage for pages requiring roles.

- **Testing & linting**
  - Web tests: `cd web/e-platform-web && npm test` (uses `react-scripts test`).
  - Mobile tests: `cd mobile/e_platform_mobile && make test`.
  - BFF currently has no test scripts; add tests under `bff/` and expose scripts in `bff/package.json` if you add CI.

- **Files to inspect for context when changing behavior**
  - BFF entry: `bff/app.js` and `bff/package.json`
  - Firebase: `bff/src/config/firebase.js` and `firebase-credentials.json` (local)
  - Example module: `bff/src/Modules/Course/` (api, model, repository, service)
  - Web routing / auth: `web/e-platform-web/src/App.jsx`, `web/e-platform-web/src/context/AuthContext`, `web/e-platform-web/src/components/shared/ProtectedRoute`
  - Mobile bootstrap: `mobile/e_platform_mobile/lib/main.dart` and `mobile/e_platform_mobile/Makefile`

- **Safety & common pitfalls**
  - Do not commit private service account keys. If you need to run locally, create `firebase-credentials.json` and add to `.gitignore`.
  - When editing Firebase init, preserve the fallback logic (env vars first, file fallback) to keep compatibility with Render/production and local development.
  - CORS: `bff/app.js` restricts origins via `allowedOrigins`. Update that list when adding new hosting targets.

- **If you need to make a code change**
  - For backend API changes: add/modify router under `bff/src/Modules/<Domain>/api`, update exports, and register the router in `bff/app.js`.
  - For data-layer changes: update repository/service in the same domain folder; follow existing naming/exception patterns.
  - For frontend changes: follow `react-query` hooks under `web/src/lib` or `web/src/services` and wrap pages with `ProtectedRoute` when role-restricted.

If any area above is unclear or you want this shortened/expanded, tell me which section to iterate on.
