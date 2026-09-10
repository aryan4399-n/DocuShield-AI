const db = require('../config/database');
function create(documentId, result, timestamp) { return db.prepare('INSERT INTO verification_results (document_id, status, score, checks_json, message, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(documentId, result.status, result.score, JSON.stringify(result.checks), result.message, timestamp); }
module.exports = { create };
