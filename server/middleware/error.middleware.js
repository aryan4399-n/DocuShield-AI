const multer = require('multer');
const { sendError } = require('../utils/response');
const { removeFiles } = require('../services/file-storage.service');
function uploadedFiles(files) {
  return Array.isArray(files) ? files : Object.values(files || {}).flat();
}
function errorHandler(error, req, res, next) {
  removeFiles(uploadedFiles(req.files));
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return sendError(res, 'FILE_TOO_LARGE', 'Each file must be within the configured size limit.', 413);
  if (error.code === 'DUPLICATE_DOCUMENT') return sendError(res, error.code, 'Each required document must be a different file. Please choose unique documents and try again.', 400);
  if (error.code && error.status) return sendError(res, error.code, error.message, error.status);
  if (error instanceof multer.MulterError || error.message === 'Unexpected field') return sendError(res, 'INVALID_UPLOAD', 'Invalid upload request.', 400);
  console.error(error);
  return sendError(res, 'SERVER_ERROR', 'The server could not complete the request.', 500);
}
module.exports = { errorHandler };
