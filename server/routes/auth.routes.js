const router = require('express').Router();
const crypto = require('crypto');
const env = require('../config/env');
const { timingSafeEqualText } = require('../config/security');
router.post('/login', (req, res) => { const token = String(req.body.token || ''); if (!timingSafeEqualText(token, env.adminToken)) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid administrator credentials.' } }); return res.json({ success: true, data: { token }, message: 'Administrator authenticated.' }); });
router.post('/logout', (req, res) => res.json({ success: true, data: {}, message: 'Administrator session closed.' }));
module.exports = router;
