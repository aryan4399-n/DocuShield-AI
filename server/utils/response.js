function sendSuccess(res, data, message = 'Request completed successfully', status = 200) {
  return res.status(status).json({ success: true, data, ...data, message });
}
function sendError(res, code, message, status = 400) {
  return res.status(status).json({ success: false, error: { code, message }, message });
}
module.exports = { sendSuccess, sendError };
