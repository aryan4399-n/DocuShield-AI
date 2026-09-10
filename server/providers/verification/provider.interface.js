class VerificationProvider {
  async verify() { throw new Error('Verification provider must implement verify().'); }
}
module.exports = VerificationProvider;
