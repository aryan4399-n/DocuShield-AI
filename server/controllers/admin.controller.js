const applicationService = require('../services/application.service');
const applicationModel = require('../models/application.model');
const documentModel = require('../models/document.model');
const { resolvePrivateFile } = require('../services/file-storage.service');
const auditService = require('../services/audit.service');
const { sendSuccess, sendError } = require('../utils/response');
function publicApplication(row) { return applicationModel.publicView(row); }
function list(req, res) { const query = String(req.query.search || '').toLowerCase(); const status = String(req.query.status || '').toLowerCase(); const applications = applicationModel.list().filter(row => { const applicant = documentModel.safeJson(row.applicant_json); const name = `${applicant.firstName || ''} ${applicant.lastName || ''}`.toLowerCase(); return (!query || row.application_id.toLowerCase().includes(query) || name.includes(query)) && (!status || row.status === status); }).map(publicApplication); return sendSuccess(res, { applications }); }
function details(req, res) { const row = applicationService.find(req.params.applicationId); if (!row) return sendError(res, 'NOT_FOUND', 'Application not found.', 404); return sendSuccess(res, { application: publicApplication(row), documents: applicationService.documents(row).map(item => documentModel.publicView(item, applicationService.labels)) }); }
function file(req, res) { const row = applicationService.find(req.params.applicationId); const document = row && documentModel.findForApplication(req.params.documentId, row.id); if (!document) return sendError(res, 'NOT_FOUND', 'Document not found.', 404); return res.download(resolvePrivateFile(document.stored_name), document.original_name); }
async function review(req, res, next) { try { const status = String(req.body.status || '').toLowerCase(); if (!['verified', 'manual_review', 'failed'].includes(status)) return sendError(res, 'INVALID_STATUS', 'Review status is invalid.'); const message = String(req.body.message || `Administrator marked this application ${status.replace('_', ' ')}.`).slice(0, 500); const row = await applicationService.review(req.params.applicationId, status, message, req.admin.id); return sendSuccess(res, { application: publicApplication(row) }); } catch (error) { next(error); } }
function auditLogs(req, res) { return sendSuccess(res, { logs: auditService.list() }); }
module.exports = { list, details, file, review, auditLogs };
