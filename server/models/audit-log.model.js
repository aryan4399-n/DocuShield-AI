const db = require('../config/database');
function create(applicationId, action, actor, details, timestamp) { return db.prepare('INSERT INTO audit_logs (application_id, action, actor, details, created_at) VALUES (?, ?, ?, ?, ?)').run(applicationId, action, actor, JSON.stringify(details || {}), timestamp); }
function list() { return db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC').all(); }
module.exports = { create, list };
