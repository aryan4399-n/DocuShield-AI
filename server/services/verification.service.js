const env = require('../config/env');
const ManualReviewProvider = require('../providers/verification/mock-provider');
const HttpVerificationProvider = require('../providers/verification/verification-provider');
const verificationModel = require('../models/verification.model');
const provider = env.verificationApiUrl && env.verificationApiKey ? new HttpVerificationProvider(env.verificationApiUrl, env.verificationApiKey) : new ManualReviewProvider();
async function verifyDocument(file, document) { const result = await provider.verify(file, document); verificationModel.create(document.id, result, new Date().toISOString()); return result; }
module.exports = { verifyDocument };
