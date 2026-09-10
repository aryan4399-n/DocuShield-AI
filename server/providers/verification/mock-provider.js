const VerificationProvider = require('./provider.interface');
class ManualReviewProvider extends VerificationProvider {
  async verify() { return { status: 'manual_review', score: null, checks: { fileValid: true, documentReadable: false, ocrPassed: false, tamperingDetected: false }, message: 'No authorized verification provider is configured. Manual review is required.' }; }
}
module.exports = ManualReviewProvider;
