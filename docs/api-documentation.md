# API documentation

All JSON responses use `{ success, data, message }`. Errors use `{ success: false, error: { code, message } }`.

- `GET /api/health`: liveness check.
- `POST /api/applications/submit`: multipart request with `applicant` JSON and required document fields.
- `GET /api/applications/:id`: applicant-safe application and document status.
- `GET /api/applications/:id/status`: status-compatible alias.
- `GET /api/admin/applications`: admin bearer token; optional `search` and `status`.
- `GET /api/admin/applications/:id`: admin application details.
- `GET /api/admin/applications/:id/documents/:documentId/file`: authenticated private download.
- `POST /api/admin/applications/:id/review`: authenticated review body `{ status, message }`.
- `GET /api/admin/audit-logs`: authenticated audit records.
