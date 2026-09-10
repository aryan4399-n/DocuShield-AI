const crypto = require('crypto');
const fs = require('fs');
function sha256File(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'); }
module.exports = { sha256File };
