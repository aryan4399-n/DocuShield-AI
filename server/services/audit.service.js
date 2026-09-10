const auditModel = require('../models/audit-log.model');
function record(applicationId, action, actor, details) { return auditModel.create(applicationId, action, actor, details, new Date().toISOString()); }
module.exports = { record, list: auditModel.list };
