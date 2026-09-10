const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT || 3000),
  maxFileMb: Number(process.env.MAX_FILE_MB || 10),
  adminToken: process.env.ADMIN_TOKEN || '',
  verificationApiUrl: process.env.VERIFICATION_API_URL || '',
  verificationApiKey: process.env.VERIFICATION_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || true,
  demoMode: String(process.env.DEMO_MODE).toLowerCase() === 'true',
  rootDir: path.resolve(__dirname, '../..'),
  clientDir: path.resolve(__dirname, '../../client'),
  dataDir: path.resolve(process.env.DATA_DIR || path.resolve(__dirname, '../database')),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || path.resolve(__dirname, '../uploads'))
};
