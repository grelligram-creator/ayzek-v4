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

## Google and Microsoft connection setup

The Google Calendar and Microsoft 365 cards in the Integration Center only
enable after all relevant Secrets are present. For a deployed `APP_URL`, add
these exact redirect URIs at the provider consoles:

- Google: `APP_URL/api/oauth/google/callback`
- Microsoft: `APP_URL/api/oauth/microsoft/callback`

Replace `APP_URL` with the public HTTPS origin, without a trailing slash. The
server signs a short-lived, single-use OAuth state and stores the returned token
response encrypted with AES-256-GCM in the user's Firestore subcollection. It
never returns raw provider tokens to the browser. Current scopes are read-only
calendar access for Google and Microsoft; no calendar entry is created or
changed by connecting an account.

## Remote Web Push

Remote push uses the standards-based Push API and VAPID. Add
`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` through the host's
secret manager. The public key is shared only with an authenticated browser;
the private key is never exposed. A user explicitly enables notifications from
Profile, then the device subscription is stored under that user in Firestore.

On iPhone and iPad, web push is supported only after AYZEK is installed to the
Home Screen as a PWA, and permission must be granted after a user gesture. The
temporary localtunnel URL is appropriate for development checks, not dependable
remote delivery. The `/api/push/test` endpoint is rate-limited and requires an
authenticated user, so it can be used by the UI or a future admin-only test
tool without exposing a public send endpoint.

## Background notification jobs

`POST /api/jobs/notification` lets an authenticated user schedule a single
push notification for their own saved devices (30 seconds to 31 days ahead).
Jobs live in Firestore and are atomically claimed by the server worker, so a
multi-instance deployment does not send the same job twice. Failed deliveries
are retried up to three times. This is a dependable application-level baseline;
high-volume or strict SLA delivery should move the scanner to a managed queue
and scheduler. Deploy the included `firestore.indexes.json` before enabling
large-scale scheduling so due-job scans use the required composite index.

For a stable public deployment, use a managed host with a custom domain or a
provider URL. AI Studio's public share is appropriate for sharing the app, but
it is not a replacement for production operations, backups, monitoring, or a
guaranteed always-on service.

## Security notes

The app verifies Firebase ID tokens at sensitive server endpoints, applies
per-endpoint rate limits, supports global session revocation, and lets users
send a new email-verification link from Profile. The current limiter is
per-process; a horizontally scaled production deployment must use a shared
store such as Redis before treating it as a global limit. Email verification
must be completed before introducing MFA. Google/Microsoft OAuth remains
intentionally unconfigured until real provider credentials and redirect URIs
are supplied.
