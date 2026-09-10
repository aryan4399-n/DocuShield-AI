const fs = require('fs');
const path = require('path');
const env = require('../config/env');
function removeFiles(files = []) { files.forEach(file => { if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path); }); }
function resolvePrivateFile(storedName) { const safeName = path.basename(storedName); const filePath = path.resolve(env.uploadDir, safeName); if (!filePath.startsWith(path.resolve(env.uploadDir) + path.sep)) throw new Error('Invalid document path.'); return filePath; }
module.exports = { removeFiles, resolvePrivateFile };
