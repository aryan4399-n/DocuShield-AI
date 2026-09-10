const db = require('../config/database');
function safeJson(value, fallback = {}) { try { return JSON.parse(value); } catch { return fallback; } }
function listForApplication(applicationId) { return db.prepare('SELECT * FROM documents WHERE application_id = ? ORDER BY id').all(applicationId); }
function create(applicationId, file, hash, timestamp) { return db.prepare('INSERT INTO documents (application_id, type, original_name, stored_name, size, mime_type, sha256, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(applicationId, file.fieldname, file.originalname, file.stored_name || file.filename, file.size, file.mimetype, hash, timestamp); }
function findForApplication(id, applicationId) { return db.prepare('SELECT * FROM documents WHERE id = ? AND application_id = ?').get(id, applicationId); }
function updateResult(id, result) { db.prepare('UPDATE documents SET status = ?, score = ?, message = ? WHERE id = ?').run(result.status, result.score, result.message, id); }
function publicView(row, labels) { return { id: row.id, type: row.type, title: labels[row.type] || row.type, name: row.original_name, size: row.size, mimeType: row.mime_type, hash: row.sha256, status: row.status, score: row.score, message: row.message, createdAt: row.created_at }; }
module.exports = { safeJson, listForApplication, create, findForApplication, updateResult, publicView };
