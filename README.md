# Notification App — SRM Submission

Quick start

- Install dependencies:

```bash
npm --prefix "d:/RA2311003030247/my-react-app" install
```

- Dev server:

```bash
npm --prefix "d:/RA2311003030247/my-react-app" run dev
# open http://localhost:5174/
```

- Build & preview (production):

```bash
npm --prefix "d:/RA2311003030247/my-react-app" run build
npm --prefix "d:/RA2311003030247/my-react-app" run preview
# open http://localhost:4173/
```

API & credentials

- The test server is `http://20.207.122.201/evaluation-service`.
- Register to obtain `clientID` and `clientSecret` (POST `/register`).
- Exchange `clientID` + `clientSecret` for an `access_token` (POST `/auth`).
- For local testing, place the token in `.env.local` as `VITE_EVAL_TOKEN=...` or set browser localStorage key `evaluationAuthToken`.

What I added

- `src/utils/logging.js` and `logging_middleware/logging.js` — reusable logging function
- `notification_app_be/top10.cjs` — script to compute top-10 priority notifications (weights + recency)
- `notification_app_be/top10.json` — generated top-10 output
- `src/Notifications.jsx` — top list display
- `src/FullNotifications.jsx` — full list with filter & pagination (Stage 2)
- `notification_system_design.md` — Stage 1 design notes
- `screenshots/top10-desktop.md` — captured output for submission
- `postman/notification-api-collection.json` — Postman collection with register/auth/notifications

Submission checklist

- [x] Logging middleware added
- [x] Stage 1 design doc added (`notification_system_design.md`)
- [x] Stage 1 implementation (top10 script + output)
- [x] Stage 2 frontend (top list + full list, filtering & pagination)
- [x] Screenshot/text capture added
- [x] Token wiring for local testing (saved in `.env.local` locally)

Notes

- Do NOT commit `.env.local` or any secrets. `.gitignore` already excludes lockfiles and env files.
- If you want me to remove `.env.local` from this machine or rotate credentials, tell me and I will do it.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
