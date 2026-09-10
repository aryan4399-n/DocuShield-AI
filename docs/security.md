# Security

Helmet, CORS, JSON limits, rate limiting, MIME/extension/signature validation, file-size limits, random private filenames, SHA-256 hashes, path-safe file resolution, timing-safe admin token comparison, and safe error responses are implemented.

The current admin token is a development boundary. Production deployment needs real users with hashed passwords, sessions or short-lived tokens, role-based access, HTTPS, CSRF protections where applicable, malware scanning, audit retention controls, provider webhook validation, secret rotation, and durable private storage.

The app never claims authenticity without a configured authorized provider. Missing or unavailable provider configuration produces `manual_review`.
