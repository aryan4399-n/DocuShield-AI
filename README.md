# DocuShieldAI / VerifyFlow

SIH26188-ready document verification platform with a modular vanilla frontend and Express backend. The app handles private uploads, SQLite metadata, SHA-256 hashes, administrator access, audit records, and an adapter for an authorized verification provider.

## Architecture

The root is intentionally split into `client/`, `server/`, `tests/`, and `docs/`. Frontend pages and assets live in `client/`. Backend routes, controllers, services, models, middleware, providers, and database schema live in `server/`. See [docs/architecture.md](docs/architecture.md).

## Requirements

- Node.js 18 or newer
- npm
- An authorized verification-provider account for automated authenticity checks
- Tesseract.js OCR is included for image text extraction; PDF OCR requires a separate PDF-to-image pipeline.

## Install and run

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) for the SIH26188 product landing page. Start the applicant flow from there; it continues to `applicant.html`, `documents.html`, and `verification.html`.

Set a long random `ADMIN_TOKEN` in `.env`. The admin page asks for this token in the browser and keeps it only in the current session. The development fallback token in the checked-out `.env` must be replaced before use beyond local testing.

## Verification provider

Set `VERIFICATION_API_URL` and `VERIFICATION_API_KEY` in `.env` only. The key is read by `services/verificationService.js` and is never sent to frontend JavaScript. The adapter sends a multipart POST containing `file`, `documentType`, and `documentId`. Because providers use different contracts, adapt that module to the authorized provider's documented endpoint and response mapping. The app never invents a successful result: without a configured provider, every document is `manual_review`.

The adapter expects a response that can be mapped to `status` (`verified`, `failed`, or `manual_review`), optional `score`, optional `checks`, and `message`. Keep provider-specific authentication and fields inside the service module.

## OCR

Tesseract.js is installed with the backend and runs in `server/services/ocr.service.js`. It reuses one worker for image documents and terminates only when the server process is shut down. OCR output is not stored because document text may contain sensitive personal information; only OCR availability, pass state, and text length are recorded in verification checks. OCR is not document authenticity verification.

## API

- `GET /api/health`
- `POST /api/applications/submit` multipart form with `applicant` JSON and document fields `governmentId`, `addressProof`, `panCard`, `photo`, `supporting`, plus optional fields
- `GET /api/applications/:applicationId`
- `GET /api/admin/applications` with `Authorization: Bearer <ADMIN_TOKEN>`
- `GET /api/admin/applications/:id` with admin authentication
- `POST /api/admin/applications/:id/review` with admin authentication and `{ "status": "verified|manual_review|failed", "message": "..." }`
- `GET /api/admin/applications/:id/documents/:documentId/file` with admin authentication
- `GET /api/admin/audit-logs` with admin authentication

Allowed files are PDF, JPG, JPEG, PNG, DOC, DOCX, and WEBP for photographs. Each file is limited to 10 MB by default. Uploads are stored outside the public directory with random names; only database metadata is returned to applicants.

## Tests

Run `npm test` for the Node test suite. Add route-level integration tests with the preferred HTTP test runner when dependencies are installed in the deployment environment.

## Production requirements

Replace the development token prompt with a real login system using hashed passwords, sessions or short-lived JWTs, role-based access control, HTTPS, CSRF protection where applicable, stricter CORS, audit logs, provider webhooks/signature validation, malware scanning, durable private object storage, backups, and a production database. Rotate all development secrets and do not commit `.env`, `uploads/`, or the SQLite database.
