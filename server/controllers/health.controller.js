const { sendSuccess } = require('../utils/response');
function health(req, res) { return sendSuccess(res, {}, 'DocuShieldAi API is running'); }
module.exports = { health };
