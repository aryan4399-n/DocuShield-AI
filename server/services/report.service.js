const PDFDocument = require('pdfkit');
const applicationModel = require('../models/application.model');
const documentModel = require('../models/document.model');
const applicationService = require('./application.service');

function createReport(applicationId, response) {
  const application = applicationService.find(applicationId);
  if (!application) return false;
  const documents = applicationService.documents(application);
  const risk = applicationService.analysis(application).risk;
  const pdf = new PDFDocument({ margin: 48 });
  pdf.pipe(response);
  pdf.fontSize(22).fillColor('#0b3d91').text('DOCUSHIELDAI');
  pdf.fontSize(10).fillColor('#475569').text('Document Verification & Risk Assessment Report');
  pdf.moveDown();
  pdf.fontSize(12).fillColor('#172033').text(`Application ID: ${application.application_id}`);
  pdf.text(`Status: ${application.status.toUpperCase()}`);
  pdf.text(`Created: ${new Date(application.created_at).toLocaleString('en-IN')}`);
  pdf.moveDown();
  pdf.fontSize(15).text('Risk assessment');
  pdf.fontSize(11).text(`Risk score: ${risk?.score ?? 'Unavailable'}/100`);
  pdf.text(`Risk level: ${risk?.level ?? 'manual_review'}`);
  if (risk?.factors) risk.factors.forEach(factor => pdf.text(`- ${factor.name}: ${factor.value ?? 'unavailable'}`));
  pdf.moveDown();
  pdf.fontSize(15).text('Documents');
  documents.forEach(document => pdf.fontSize(11).text(`${document.original_name} | ${document.status.toUpperCase()} | SHA-256 ${document.sha256}`));
  pdf.moveDown();
  pdf.fontSize(9).fillColor('#64748b').text('This report is an AI-assisted risk assessment. It is not proof of government database authentication.');
  pdf.end();
  return true;
}

module.exports = { createReport };