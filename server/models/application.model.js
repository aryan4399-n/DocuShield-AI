const db = require('../config/database');
const { safeJson } = require('./document.model');

function findByApplicationId(applicationId) { return db.prepare('SELECT * FROM applications WHERE application_id = ?').get(applicationId); }
function findById(id) { return db.prepare('SELECT * FROM applications WHERE id = ?').get(id); }
function list() { return db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all(); }
function create(applicationId, applicant, timestamp) { return db.prepare('INSERT INTO applications (application_id, applicant_json, created_at, updated_at) VALUES (?, ?, ?, ?)').run(applicationId, JSON.stringify(applicant), timestamp, timestamp); }
function updateStatus(id, status, score, message, timestamp) { db.prepare('UPDATE applications SET status = ?, score = ?, message = ?, updated_at = ? WHERE id = ?').run(status, score, message, timestamp, id); }
function publicView(row) { return { applicationId: row.application_id, applicant: safeJson(row.applicant_json), status: row.status, score: row.score, message: row.message, createdAt: row.created_at, updatedAt: row.updated_at }; }
module.exports = { findByApplicationId, findById, list, create, updateStatus, publicView };
