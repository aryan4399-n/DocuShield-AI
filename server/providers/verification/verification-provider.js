const fs = require('fs');
const path = require('path');
const VerificationProvider = require('./provider.interface');
function normalizeStatus(value) { const status = String(value || '').toLowerCase(); return ['verified', 'failed', 'manual_review'].includes(status) ? status : 'manual_review'; }
class HttpVerificationProvider extends VerificationProvider {
  constructor(url, apiKey) { super(); this.url = url; this.apiKey = apiKey; }
  async verify(file, document) {
    const body = new FormData(); body.append('file', new Blob([fs.readFileSync(file.path)], { type: file.mimetype }), path.basename(file.originalname)); body.append('documentType', document.type); body.append('documentId', String(document.id));
    try {
      const response = await fetch(this.url, { method: 'POST', headers: { Authorization: `Bearer ${this.apiKey}` }, body, signal: AbortSignal.timeout(30000) });
      if (!response.ok) return { status: 'manual_review', score: null, checks: {}, message: `Verification provider returned HTTP ${response.status}. Manual review is required.` };
      const result = await response.json(); const checks = result && typeof result.checks === 'object' ? result.checks : {};
      return { status: normalizeStatus(result.status || result.verificationStatus), score: Number.isFinite(Number(result.score)) ? Number(result.score) : null, checks: { fileValid: checks.fileValid !== false, documentReadable: checks.documentReadable === true, ocrPassed: checks.ocrPassed === true, tamperingDetected: checks.tamperingDetected === true }, message: String(result.message || 'Provider returned no message.') };
    } catch { return { status: 'manual_review', score: null, checks: {}, message: 'Verification provider is unavailable. Manual review is required.' }; }
  }
}
module.exports = HttpVerificationProvider;
