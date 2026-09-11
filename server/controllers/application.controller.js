const service = require('../services/application.service');
const { sendSuccess, sendError } = require('../utils/response');
const reportService = require('../services/report.service');
function publicApplication(row) { const model = require('../models/application.model'); return model.publicView(row); }
function publicDocuments(row) { const model = require('../models/document.model'); return service.documents(row).map(item => model.publicView(item, service.labels)); }
function publicAnalysis(row) { const analysis = service.analysis(row); return { risk: analysis.risk, documents: analysis.documents.map(item => ({ documentId: item.document_id, type: item.type, ocrConfidence: item.ocr_confidence, fields: JSON.parse(item.extracted_fields_json), quality: JSON.parse(item.quality_json), tamper: JSON.parse(item.tamper_json) })) }; }
function parseApplicant(value) {
  let applicant;
  try { applicant = typeof value === 'string' ? JSON.parse(value) : value; } catch { return null; }
  if (!applicant || Array.isArray(applicant) || typeof applicant !== 'object') return null;

  const clean = (key, maxLength) => String(applicant[key] || '').trim().slice(0, maxLength);
  const result = {
    firstName: clean('firstName', 80), lastName: clean('lastName', 80),
    email: clean('email', 254).toLowerCase(), mobile: clean('mobile', 30),
    dob: clean('dob', 10), country: clean('country', 80), purpose: clean('purpose', 120),
    consent: applicant.consent === true || applicant.consent === 'true'
  };
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email);
  if (!result.firstName || !result.lastName || !emailIsValid || !result.consent) return null;
  return result;
}
async function submit(req, res, next) {
  try {
    const applicant = parseApplicant(req.body.applicant);
    if (!applicant) return sendError(res, 'INVALID_APPLICANT', 'Provide a name, valid email address, and consent.');
    const files = Object.values(req.files || {}).flat();
    const row = await service.submit(applicant, files);
    return sendSuccess(res, { application: publicApplication(row), documents: publicDocuments(row) }, 'Application submitted successfully', 201);
  } catch (error) { next(error); }
}
function get(req, res) { const row = service.find(req.params.applicationId); if (!row) return sendError(res, 'NOT_FOUND', 'Application not found.', 404); return sendSuccess(res, { application: publicApplication(row), documents: publicDocuments(row), analysis: publicAnalysis(row) }); }
function report(req, res) { const row = service.find(req.params.applicationId); if (!row) return sendError(res, 'NOT_FOUND', 'Application not found.', 404); res.type('pdf').attachment(`${row.application_id}-report.pdf`); if (!reportService.createReport(req.params.applicationId, res)) return sendError(res, 'REPORT_FAILED', 'Report could not be generated.', 500); }
module.exports = { submit, get, report };
