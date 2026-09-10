const documentModel = require('../models/document.model');
const { resolvePrivateFile } = require('./file-storage.service');
function getPrivateDocument(applicationId, documentId) { return documentModel.findForApplication(documentId, applicationId); }
module.exports = { getPrivateDocument, resolvePrivateFile };
