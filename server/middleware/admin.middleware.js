const env = require('../config/env');
const { timingSafeEqualText } = require('../config/security');
const { sendError } = require('../utils/response');
function requireAdmin(req, res, next) {
  const supplied = req.get('authorization')?.replace(/^Bearer\s+/i, '') || req.get('x-admin-token');
  const expected = env.adminToken;
  if (!timingSafeEqualText(supplied, expected)) return sendError(res, 'UNAUTHORIZED', 'Administrator authentication required.', 401);
  req.admin = { id: 'admin-token' };
  next();
}
module.exports = { requireAdmin };
