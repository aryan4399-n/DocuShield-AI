const db = require('../config/database');
function saveDocument(documentId, analysis, timestamp) {
  db.prepare(`INSERT INTO document_analyses (document_id, ocr_text, extracted_fields_json, ocr_confidence, quality_json, tamper_json, processed_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(document_id) DO UPDATE SET ocr_text = excluded.ocr_text, extracted_fields_json = excluded.extracted_fields_json, ocr_confidence = excluded.ocr_confidence, quality_json = excluded.quality_json, tamper_json = excluded.tamper_json, processed_at = excluded.processed_at`).run(documentId, analysis.ocrText, JSON.stringify(analysis.fields), analysis.ocrConfidence, JSON.stringify(analysis.quality), JSON.stringify(analysis.tamper), timestamp);
  db.prepare('DELETE FROM verification_checks WHERE document_id = ?').run(documentId);
  const insert = db.prepare('INSERT INTO verification_checks (document_id, check_name, passed, details, created_at) VALUES (?, ?, ?, ?, ?)');
  Object.entries(analysis.checks).forEach(([name, check]) => insert.run(documentId, name, check.passed ? 1 : 0, check.details, timestamp));
}
function listForApplication(applicationId) { return db.prepare('SELECT a.*, d.type, d.original_name FROM document_analyses a JOIN documents d ON d.id = a.document_id WHERE d.application_id = ? ORDER BY d.id').all(applicationId); }
function saveRisk(applicationId, risk, timestamp) { db.prepare(`INSERT INTO risk_assessments (application_id, score, level, factors_json, consistency_json, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(application_id) DO UPDATE SET score = excluded.score, level = excluded.level, factors_json = excluded.factors_json, consistency_json = excluded.consistency_json, created_at = excluded.created_at`).run(applicationId, risk.score, risk.level, JSON.stringify(risk.factors), JSON.stringify(risk.consistency), timestamp); }
function getRisk(applicationId) { return db.prepare('SELECT * FROM risk_assessments WHERE application_id = ?').get(applicationId); }
function parse(row) { if (!row) return null; return { score: row.score, level: row.level, factors: JSON.parse(row.factors_json), consistency: JSON.parse(row.consistency_json), createdAt: row.created_at }; }
module.exports = { saveDocument, listForApplication, saveRisk, getRisk, parse };
