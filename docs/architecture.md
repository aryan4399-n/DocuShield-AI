# Architecture

DocuShieldAI uses a vanilla HTML/CSS/JavaScript client and an Express server. The client is served from `client/` and never contains provider credentials. The server composition root is `server/server.js`.

## Request flow

Applicant UI -> REST route -> controller -> service -> model/database -> provider adapter -> response.

Uploads are written to `server/uploads/` with random filenames. That directory is not served by Express. Admin file access passes through `requireAdmin`, application ownership checks, and a path-safe resolver.

## Boundaries

- `client/`: pages, visual assets, API client, UI behavior.
- `server/routes/`: URL and middleware composition.
- `server/controllers/`: HTTP parsing and response mapping.
- `server/services/`: application workflow and provider orchestration.
- `server/models/`: SQLite queries.
- `server/providers/`: replaceable verification integrations.
- `server/middleware/`: security, uploads, authorization, and errors.
- `tests/`: API, service, security, and frontend test homes.
