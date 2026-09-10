const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
fs.mkdirSync(env.uploadDir, { recursive: true });
const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.webp']);
const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const storage = multer.diskStorage({ destination: env.uploadDir, filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({ storage, limits: { fileSize: env.maxFileMb * 1024 * 1024, files: 30 }, fileFilter: (req, file, callback) => { const extension = path.extname(file.originalname).toLowerCase(); callback(null, allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype)); } });
function hasExpectedSignature(file) { const bytes = fs.readFileSync(file.path); if (!bytes.length) return false; if (file.mimetype === 'application/pdf') return bytes.subarray(0, 5).toString() === '%PDF-'; if (file.mimetype === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff; if (file.mimetype === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); if (file.mimetype === 'image/webp') return bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'; if (file.mimetype === 'application/msword') return bytes.subarray(0, 8).equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225])); if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return bytes.subarray(0, 2).toString() === 'PK'; return false; }
module.exports = { upload, hasExpectedSignature };
