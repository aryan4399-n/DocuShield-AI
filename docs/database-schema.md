# Database schema

SQLite is initialized from `server/database/schema.sql`.

- `applications`: applicant JSON, public application ID, aggregate status/score, timestamps.
- `documents`: private stored filename, original metadata, SHA-256, per-document status.
- `verification_results`: provider result, checks JSON, score, message, timestamp.
- `audit_logs`: application, action, actor, details, timestamp.

Documents reference applications; verification results reference documents; audit logs reference applications. Foreign keys and cascade cleanup are enabled.
