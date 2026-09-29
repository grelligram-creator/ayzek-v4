# AYZEK OS

AYZEK OS is a personal planning and assistant application. The client is built
with React/Vite; authenticated AI and account-security endpoints are served by
the Node/Express runtime.

## Local development

1. Use Node.js 22 or newer.
2. Copy `.env.example` to `.env` and provide only the secrets needed for the
   feature you are testing. Do not commit `.env`.
3. Install packages with `npm ci`.
4. Start the app with `npm run dev`.

The localtunnel link is useful for temporary phone testing only. It is tied to
the computer and development server that created it; it is not a production
deployment.

## Production readiness

Run the following before deployment:

```
npm run lint
npm run build
NODE_ENV=production npm start
```

`npm run build` produces both the Vite client and `dist/server.mjs`. In
production the server delivers the compiled client and exposes:

- `GET /api/health` — process liveness
- `GET /api/ready` — dependency readiness (Gemini and Firebase Admin)

Set secrets through the host's secret manager, never in source control:

- `GEMINI_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- OAuth client secrets when Google/Microsoft connection is enabled
- `OAUTH_TOKEN_ENCRYPTION_KEY` when OAuth token storage is enabled

For a stable public deployment, use a managed host with a custom domain or a
provider URL. AI Studio's public share is appropriate for sharing the app, but
it is not a replacement for production operations, backups, monitoring, or a
guaranteed always-on service.

## Security notes

The app verifies Firebase ID tokens at sensitive server endpoints, applies
endpoint rate limits, supports global session revocation, and lets users send a
new email-verification link from Profile. Email verification must be completed
before introducing MFA. Google/Microsoft OAuth remains intentionally
unconfigured until real provider credentials and redirect URIs are supplied.
