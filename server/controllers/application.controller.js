const service = require('../services/application.service');
const { sendSuccess, sendError } = require('../utils/response');
function publicApplication(row) { const model = require('../models/application.model'); return model.publicView(row); }
function publicDocuments(row) { const model = require('../models/document.model'); return service.documents(row).map(item => model.publicView(item, service.labels)); }
async function submit(req, res, next) { try { const applicant = JSON.parse(req.body.applicant || 'null'); if (!applicant || typeof applicant !== 'object') return sendError(res, 'INVALID_APPLICANT', 'Applicant information is required.'); const row = await service.submit(applicant, req.files || []); return sendSuccess(res, { application: publicApplication(row), documents: publicDocuments(row) }, 'Application submitted successfully', 201); } catch (error) { next(error); } }
function get(req, res) { const row = service.find(req.params.applicationId); if (!row) return sendError(res, 'NOT_FOUND', 'Application not found.', 404); return sendSuccess(res, { application: publicApplication(row), documents: publicDocuments(row) }); }
module.exports = { submit, get };
