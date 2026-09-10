const env = require('../config/env');
const ManualReviewProvider = require('../providers/verification/mock-provider');
const HttpVerificationProvider = require('../providers/verification/verification-provider');
const verificationModel = require('../models/verification.model');
const ocrService = require('./ocr.service');
const provider = env.verificationApiUrl && env.verificationApiKey ? new HttpVerificationProvider(env.verificationApiUrl, env.verificationApiKey) : new ManualReviewProvider();
async function verifyDocument(file, document) {
	const [result, ocr] = await Promise.all([provider.verify(file, document), ocrService.extract(file)]);
	const checks = { ...(result.checks || {}), ocrAvailable: ocr.available, ocrPassed: ocr.passed, ocrTextLength: ocr.textLength, ocrConfidence: ocr.confidence, extractedFields: ocr.fields };
	const status = result.status === 'verified' && !ocr.passed ? 'manual_review' : result.status;
	const message = status === 'manual_review' && result.status === 'verified' ? 'Provider returned a result, but OCR could not confirm readable text. Manual review is required.' : result.message;
	const combined = { ...result, status, checks, message, ocr: { text: ocr.text || '', confidence: ocr.confidence || 0, fields: ocr.fields || {}, available: ocr.available } };
	verificationModel.create(document.id, combined, new Date().toISOString());
	return combined;
}
module.exports = { verifyDocument };
